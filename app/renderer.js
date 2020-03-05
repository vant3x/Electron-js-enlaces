// DOM Elements
const linksSection = document.querySelector('.list-links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const inputNewLinkUrl = document.querySelector('.input-new-link-url');
const btnNewLink = document.querySelector('#btn-new-link');
const btnClearStorage = document.querySelector('.btn-clear-storage');

// DOM APIs
const parser = new DOMParser();
 const { shell } = require('electron');
const parserResponse = text => {
   return  parser.parseFromString(text, 'text/html');
}

const findTitle = nodes => {
    return nodes.querySelector('title').innerText;
};


const storeLink = (title,url) => {
    localStorage.setItem(url, JSON.stringify({title,url}));
}

const getLinksStorage = () => {
    return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));
}


const createLinkElement = link => {
    return `
        <div>
            <h3>${link.title}</h3>
            <p>
                <a href="${link.url}" class="enlace">${link.url}</a>
            </p>
        </div>
    `;
}

const renderLinks = () => {
   const linksElements =  getLinksStorage().map(createLinkElement).join('');
   linksSection.innerHTML = linksElements;
   
}

const clearForm = () => {
    inputNewLinkUrl.value = null;
}

const handleError = (error, url) => {
   errorMessage.innerHTML = `
        Ocurrió un error y no se pudó agregar el enlace "${url}" : ${error.message}
   `.trim();
   setTimeout(() => {
       errorMessage.innerHTML = null;
   },   5000);                      
}

// Events
renderLinks();

inputNewLinkUrl.addEventListener('keyup', () => {
  let btnNuevoLinkEstado =  btnNewLink.disabled = !inputNewLinkUrl.validity.valid;
  if(btnNuevoLinkEstado) {
    btnNewLink.classList.add('btn-new-link-disabled');
    btnNewLink.classList.remove('btn-new-link');
  } else {
    btnNewLink.classList.remove('btn-new-link-disabled');
    btnNewLink.classList.add('btn-new-link');
  }
});

newLinkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = inputNewLinkUrl.value;
    try {
        const response = await fetch(url);
        const text = await response.text();
        const html = parserResponse(text);
        const title = findTitle(html);
        storeLink(title, url);
        clearForm();
        renderLinks();
    } catch (error) {
        handleError(error, url);
    }
});

btnClearStorage.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
});


linksSection.addEventListener('click', (e) => {
    if (e.target.href) {
        e.preventDefault();
        shell.openExternal(e.target.href);
    }
});
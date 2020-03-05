// DOM Elements
const linksSection = document.querySelector('.list-links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const inputNewLinkUrl = document.querySelector('.input-new-link-url');
const btnNewLink = document.querySelector('#btn-new-link');
const btnClearStorage = document.querySelector('.btn-clear-storage');

// DOM APIs
const parser = new DOMParser();
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
                <a href="${link.url}">${link.url}</a>
            </p>
        </div>
    `;
}

const renderLinks = () => {
   const linksElements =  getLinksStorage().map(createLinkElement).join('');
   linksSection.innerHTML = linksElements;
   
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
    const response = await fetch(url);
    const text = await response.text();
    const html = parserResponse(text);
    const title = findTitle(html);
    storeLink(title, url);
    renderLinks();
});
import ApiService from './api-service';
import getRefs from './get-refs';
import markup from './markup';
import modal from './lightbox';
import throttle from 'lodash.throttle';

const refs = getRefs();
const apiService = new ApiService();
let currentWindowHeight = 0;

refs.form.addEventListener('submit', onSearch);
window.addEventListener('scroll', throttle(onScroll, 500));
refs.galleryContainer.addEventListener('click', openModal);

function onSearch(e) {
  e.preventDefault();
  modal.loadingPlaceholder.show();
  let searchField = e.currentTarget.elements.query;
  if (searchField.value === '') return;
  markup.clearImageContainer();
  apiService.page = 1;
  apiService.searchQuery = searchField.value;
  apiService.fetchImages().then(data => {
    markup.renderImageCards(data);
    modal.loadingPlaceholder.close();
  });
  searchField.value = '';
}

function onScroll(e) {
  if (
    pageYOffset + document.documentElement.clientHeight >
    document.documentElement.scrollHeight - 10
  ) {
    modal.loadingPlaceholder.show();
    apiService.fetchImages().then(data => {
      apiService.page += 1;
      currentWindowHeight = refs.galleryContainer.offsetHeight;
      markup.renderImageCards(data);
      modal.loadingPlaceholder.close();
      window.scrollTo({
        top: currentWindowHeight + refs.header.offsetHeight,
        left: 0,
        behavior: 'smooth',
      });
    });
  }
}

function openModal(e) {
  if (e.target.nodeName !== 'IMG') return;
  modal.bigImg(e.target.dataset.src).show();
}

const scrollY = document.body.style.top;
document.body.style.position = '';
document.body.style.top = '';
window.scrollTo(0, parseInt(scrollY || '0') * -1);

import ApiService from './api-service';
import getRefs from './get-refs';
import markup from './markup';
import modal from './lightbox';
import throttle from 'lodash.throttle';
import notification from './notifications';

const refs = getRefs();
const apiService = new ApiService();
let currentWindowHeight = 0;
const throttledScroll = throttle(onScroll, 500);

refs.form.addEventListener('submit', onSearch);
refs.galleryContainer.addEventListener('click', openModal);

function onSearch(e) {
  e.preventDefault();
  modal.loadingPlaceholder.show();
  let searchField = e.currentTarget.elements.query;
  if (searchField.value === '') {
    notification.throwErrorNoQuery();
    modal.loadingPlaceholder.close();
    return;
  }
  markup.clearImageContainer();
  apiService.page = 1;
  apiService.searchQuery = searchField.value;
  apiService
    .countImages()
    .then(count => {
      if (count === 0) {
        notification.throwErrorNotFound();
        modal.loadingPlaceholder.close();
        return;
      }
      apiService
        .fetchImages()
        .then(data => {
          markup.renderImageCards(data);
          window.addEventListener('scroll', throttledScroll);
          modal.loadingPlaceholder.close();
        })
        .catch(error => {
          notification.throwNotice();
          modal.loadingPlaceholder.close();
        });
    })
    .catch(error => {
      notification.throwNotice();
      modal.loadingPlaceholder.close();
    });
  searchField.value = '';
}

function onScroll(e) {
  if (
    pageYOffset + document.documentElement.clientHeight >
    document.documentElement.scrollHeight - 1
  ) {
    modal.loadingPlaceholder.show();
    apiService
      .countImages()
      .then(count => {
        if (count === refs.galleryContainer.childElementCount) {
          notification.throwInfo();
          window.removeEventListener('scroll', throttledScroll);
          modal.loadingPlaceholder.close();
          return;
        }
        apiService
          .fetchImages()
          .then(data => {
            apiService.page += 1;
            currentWindowHeight = refs.galleryContainer.offsetHeight;
            markup.renderImageCards(data);
            modal.loadingPlaceholder.close();
            window.scrollTo({
              top: currentWindowHeight, //+ refs.header.offsetHeight,
              left: 0,
              behavior: 'smooth',
            });
          })
          .catch(error => {
            notification.throwNotice();
            modal.loadingPlaceholder.close();
          });
      })
      .catch(error => {
        notification.throwNotice();
        modal.loadingPlaceholder.close();
      });
  }
}

function openModal(e) {
  if (e.target.nodeName !== 'IMG') return;
  modal.bigImg(e.target.dataset.src).show();
}

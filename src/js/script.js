import ApiService from './api-service';
import getRefs from './get-refs';
import markup from './markup';
import modal from './lightbox';

const refs = getRefs();
const apiService = new ApiService();

apiService.fetchImages().then(console.log);
// apiService.fetchImages().then(markup.renderImageCards);

refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  modal.loadingPlaceholder.show();
  let searchField = e.currentTarget.elements.query;
  if (searchField.value === '') return;
  markup.clearImageContainer();
  apiService.page = 1;
  apiService.searchQuery = searchField.value;
  apiService.fetchImages().then(markup.renderImageCards);
  searchField.value = '';
  modal.loadingPlaceholder.close();
}

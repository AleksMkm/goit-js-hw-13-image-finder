const KEY = '18962627-3cde470dd8252503102b1f7f8';
const BASE_URL = `https://pixabay.com/api/`;

export default class ApiService {
  constructor() {
    this._page = 1;
    this._searchQuery = '';
  }

  async fetchImages() {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this._searchQuery}&page=${this._page}&per_page=12&key=${KEY}`;

    return this.getData(url).then(response => {
      return response.hits;
    });
  }

  async countImages() {
    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this._searchQuery}&page=${this._page}&per_page=12&key=${KEY}`;

    return this.getData(url).then(response => {
      return response.totalHits;
    });
  }

  async getData(url) {
    const images = await fetch(url);
    const response = await images.json();
    return response;
  }

  get searchQuery() {
    return this._searchQuery;
  }

  set searchQuery(newSearchQuery) {
    this._searchQuery = newSearchQuery;
  }

  get page() {
    return this._page;
  }

  set page(newPage) {
    this._page = newPage;
  }
}

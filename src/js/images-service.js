const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25683514-2bb572422bae18aceebfa826b';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const parameters = `q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    const url = `${BASE_URL}?key=${API_KEY}&${parameters}`;

    return fetch(url).then(res => {
      this.page += 1;
      return res.json();
    });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}

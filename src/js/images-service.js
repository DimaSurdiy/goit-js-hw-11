import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25683514-2bb572422bae18aceebfa826b';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const parameters = `q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    const url = `${BASE_URL}?key=${API_KEY}&${parameters}`;

    try {
      const response = await axios.get(url);
      this.page += 1;
      return response.data;
    } catch (error) {
      console.log(error);
    }
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

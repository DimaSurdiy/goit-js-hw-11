import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/images-service';
import cardTpl from './templates/photo-card.hbs';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const imagesApiService = new ImagesApiService();
const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.searchQuery.value;

  if (searchQuery === '') {
    return Notify.warning('Please, enter the text');
  }

  clearGallery();
  hideLoadMoreBtn();
  imagesApiService.query = searchQuery;
  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(images => {
    if (images.totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    Notify.success(`Hooray! We found ${images.totalHits} images.`);
    renderGalleryImages(images);
    lightbox.refresh();
    showLoadMoreBtn();
  });
}

function onLoadMoreBtnClick() {
  imagesApiService.fetchImages().then(images => {
    if (images.hits.length === 0) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      hideLoadMoreBtn();
      return;
    }

    renderGalleryImages(images);
    lightbox.refresh();
    pageScrolling();
  });
}

function renderGalleryImages(images) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTpl(images.hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.hidden = false;
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.hidden = true;
}

function pageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/images-service';
import photoCardTpl from './templates/photo-card.hbs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.gallery.addEventListener('click', onGalleryItemsClick);

function onFormSubmit(e) {
  e.preventDefault();

  clearGallery();
  refs.loadMoreBtn.classList.add('is-hidden');

  imagesApiService.searchQuery = e.currentTarget.searchQuery.value.trim();
  if (imagesApiService.searchQuery === '') {
    return;
  }

  imagesApiService.resetPage();

  imagesApiService
    .fetchImages()
    .then(images => {
      if (images.hits.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }

      const totalImages = images.totalHits;
      Notify.success(`Hooray! We found ${totalImages} images.`);

      appendImagesMarkup(images);
      imagesApiService.incrementPage();
      refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(error => console.log(error.message));
}

function onLoadMoreBtnClick() {
  imagesApiService
    .fetchImages()
    .then(images => {
      if (images.hits.length === 0) {
        Notify.info('We`re sorry, but you`ve reached the end of search results.');
        refs.loadMoreBtn.classList.add('is-hidden');
        return;
      }

      appendImagesMarkup(images);
      imagesApiService.incrementPage();
      smoothPageScrolling();
    })
    .catch(error => console.log(error.message));
}

function appendImagesMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(images));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function onGalleryItemsClick(e) {
  e.preventDefault();
  let gallery = new SimpleLightbox('.gallery a');
}

function smoothPageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

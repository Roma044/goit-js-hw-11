import './css/main.css';
import Notiflix from 'notiflix';
import { fetchPicture } from './fetchPictures';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let totalPages;

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('input'),
  searchBtn: document.querySelector('button[type="submit"]'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

function onFormSubmited(event) {
  event.preventDefault();
  refs.galleryContainer.innerHTML = '';
  page = 1;
  loadNewPictures();
}

function onLoadMore() {
  page += 1;
  loadNewPictures();
}

async function loadNewPictures() {
  const inputValue = refs.searchInput.value.trim();
  const data = await fetchPicture(inputValue, page);
  totalPages = data.totalHits / 40;
  refs.loadMoreBtn.style.display = 'block';

  if (
    totalPages - page >= -1 &&
    totalPages - page <= 0 &&
    data.hits.length !== 0
  ) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results.'
    );
  } else if (data.hits.length === 0) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (page === 1) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }

  insertNewPhotos(data.hits);
  smoothScroll();
  simpleGallery.refresh();
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.galleryContainer.firstElementChild.getBoundingClientRect();
  setTimeout(() => {
    window.scrollBy({
      left: 0,
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 550);
}

function buildCards(pictures) {
  const markup = pictures
    .map(
      picture => `
  <div class="photo-card">
  <a href='${picture.largeImageURL}'><img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" width=300 height=200/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${picture.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${picture.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${picture.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${picture.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  return markup;
}

function insertNewPhotos(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', buildCards(hits));
}

var simpleGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onFormSubmited);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

import axiosTheme from './js/api-service';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
};
let search = '';
let previousSearch = '';
let page = 1;

var lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.classList.add('is-hidden');

async function onSearch(evt) {
    try {
        evt.preventDefault();
        search = evt.target.elements.searchQuery.value.trim();
        if (search !== previousSearch) {
            page = 1;
            refs.gallery.innerHTML = '';
        }
        refs.loadMore.classList.add('is-hidden');
        await axiosTheme(search, page)
            .then(data => {
                let lastPage = (Number((data.totalHits / 40).toFixed(0)));
                if (page === lastPage) {
                    refs.loadMore.classList.add('is-hidden');
                    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                }
                if (data.totalHits === 0) {
                    Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
                } else if (search !== previousSearch) {
                    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
                    previousSearch = search;
                }
                if (data.totalHits > 40) {
                    refs.loadMore.classList.remove('is-hidden');
                    appearloadMoreBtn();
                    refs.loadMore.addEventListener('click', onLoadBtn);
                }
                renderGallery(data);
                page += 1;
                lightbox.refresh();
                scrollByElement(refs.gallery);
            })
    } catch (error) { 
        if (error.name === 'AxiosError') {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        };
    }
} 

async function onLoadBtn(evt) {
    try { 
        if (search !== previousSearch) {
            page = 1;
            refs.gallery.innerHTML = '';
        }
        await axiosTheme(search, page).then(data => {
            let lastPage = (Number((data.totalHits / 40).toFixed(0)));
                if (page === lastPage) {
                    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                    refs.loadMore.classList.add('is-hidden');
                }
            renderGallery(data);
            page += 1;
            lightbox.refresh();
            scrollByElement(refs.gallery);
        })
    } catch (error) { 
        if (error.name === 'AxiosError') {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        };
    }
}

function createMarkUp( largeImageURL, webformatURL, tags, likes, views, comments, downloads ) { 
    return `
    <div class="photo-card">
    <a href = "${largeImageURL}" alt="foto"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
        <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
        <b>Views</b> ${views}
    </p>
    <p class="info-item">
        <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
        <b>Downloads</b> ${downloads}
    </p>
    </div>
    </div>
    `
}

function renderGallery(data) {
    for (let i = 0; i < data.hits.length; i += 1) {
        const markUp = createMarkUp(data.hits[i].webformatURL, data.hits[i].largeImageURL, data.hits[i].tags, data.hits[i].likes, data.hits[i].views, data.hits[i].comments, data.hits[i].downloads);
        refs.gallery.insertAdjacentHTML("beforeend", markUp);
    }
}

function appearloadMoreBtn() {
    refs.loadMore.remove();
    refs.gallery.after(refs.loadMore);
    refs.loadMore.classList.add('load-more');
}

function scrollByElement() {
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

import React, { useState, useEffect, useRef } from 'react';
import Notify from 'notiflix/build/notiflix-notify-aio';
import getImages from './API/Api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [loadMore, setLoadMore] = useState(false);
  const [toTop, setToTop] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      try {
        const response = await getImages(query, page);
        const imageData = response.data;
        const imageCount = imageData.hits.length;
        const imageTotal = imageData.totalHits;
        const totalPages = Math.round(imageTotal / imageCount);
        if (imageCount === 0) {
          setImages([]);
          setLoadMore(false);
          setToTop(false);
          Notify.failure(
            `Sorry, there are no images matching your search query: ${query}. Please try again.`
          );
          return;
        }
        if (imageCount < 12) {
          setImages(prevImages => [...prevImages, ...imageData.hits]);
          setToTop(true);
          if (page === 1) {
            setLoadMore(false);
            Notify.success(
              `Maximum search value found, there are ${imageCount} images.`
            );
          }
        } else {
          setImages(prevImages => [...prevImages, ...imageData.hits]);
          setLoadMore(page !== totalPages);
          if (page >= 2 && page <= 41) {
            setLoadMore(true);
            setToTop(true);
          } else if (page === 42) {
            setToTop(true);
            setLoadMore(false);
          } else if (imageTotal > 12) {
            setLoading(true);
            setLoadMore(true);
            setToTop(true);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, query]);

  const bottomRef = useRef();
  const handleSubmit = newQuery => {
    setLoading(true);
    setImages([]);
    setQuery(newQuery);
    setPage(1);
  };

  const handleOpenModal = url => {
    setOpenModal(true);
    setLargeImageURL(url);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    setLoading(true);
    setLoadMore(true);
    setToTop(true);
  };

  const backToTop = () => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setLargeImageURL('');
  };

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />

      <ImageGallery
        images={images}
        openModal={handleOpenModal}
        loadMore={handleLoadMore}
      />
      <div ref={bottomRef}></div>
      {loading && <Loader />}
      <div className="Center-buttons">
        {loadMore && <Button clickHandler={handleLoadMore} text="Load More" />}
        {toTop && <Button clickHandler={backToTop} text="To Top" />}
      </div>
      {openModal && (
        <Modal largeImageURL={largeImageURL} modalClose={handleModalClose} />
      )}
    </div>
  );
};

export default App;

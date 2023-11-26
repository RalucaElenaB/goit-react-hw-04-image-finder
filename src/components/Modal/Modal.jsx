import PropTypes from 'prop-types';
import './Modal.modules.css';
import { useEffect } from 'react';

const Modal = props => {
  const { largeImageURL, tags, modalClose } = props;

  const handleBackdropClose = e => {
    if (e.target === e.currentTarget) {
      modalClose();
    }
  };

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      modalClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="Overlay" onClick={handleBackdropClose}>
      <div className="Modal">
        <img src={largeImageURL} alt={tags} />
      </div>
    </div>
  );
};

Modal.defaultProps = {
  largeImageURL: 'https://picsum.photos/100%/260',
  tags: 'This is a default image. I am sorry, the image you searched is not available.',
};

Modal.propTypes = {
  largeImageURL: PropTypes.string,
  tags: PropTypes.string,
};

export default Modal;

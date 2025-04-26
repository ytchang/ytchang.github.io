import React, { useState } from 'react';
import styles from './Gallery.module.css';

interface Series {
  title: string;
  description: string;
  images: string[];
}

interface GalleryProps {
  series: Series[];
}

export const Gallery: React.FC<GalleryProps> = ({ series }) => {
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handleSeriesClick = (series: Series) => {
    setSelectedSeries(series);
    setSelectedImage(series.images[0]);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (!selectedSeries) return;
    const newIndex = currentImageIndex === 0 
      ? selectedSeries.images.length - 1 
      : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(selectedSeries.images[newIndex]);
  };

  const handleNextImage = () => {
    if (!selectedSeries) return;
    const newIndex = currentImageIndex === selectedSeries.images.length - 1 
      ? 0 
      : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(selectedSeries.images[newIndex]);
  };

  const closeLightbox = () => {
    setSelectedSeries(null);
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  return (
    <div className={styles.gallery}>
      {series.map((item, index) => (
        <div key={index} onClick={() => handleSeriesClick(item)}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <img src={item.images[0]} alt={item.title} />
        </div>
      ))}

      {selectedImage && selectedSeries && (
        <div className={styles.lightboxContent} onClick={closeLightbox}>
          <div className={styles.imageSection} onClick={(e) => e.stopPropagation()}>
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevImage}
            >
              ←
            </button>
            <div className={styles.lightboxImageWrapper}>
              <img 
                src={selectedImage} 
                alt={`${selectedSeries.title} - Image ${currentImageIndex + 1}`}
                className={styles.lightboxImage}
              />
            </div>
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNextImage}
            >
              →
            </button>
          </div>
          <div className={styles.seriesInfo}>
            <h2>{selectedSeries.title}</h2>
            <p>{selectedSeries.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 
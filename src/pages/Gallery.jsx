import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import GalleryCSS from "../css/Gallery.module.css";
import galleryData from "../data/GalleryData";

// Function to import all cover images and series images
const importAllImages = (r) => {
  const coverImages = {};
  const seriesImages = {};

  r.keys().forEach((key) => {
    // Extract series name from path (e.g., "./series1/cover.jpg" -> "series1")
    const seriesName = key.split('/')[1];
    
    if (!seriesImages[seriesName]) {
      seriesImages[seriesName] = [];
    }

    if (key.toLowerCase().includes('cover.')) {
      coverImages[seriesName] = r(key);
      seriesImages[seriesName].unshift(r(key));
    } else {
      seriesImages[seriesName].push(r(key));
    }
  });

  return { coverImages, seriesImages };
};

// Import all images with case-insensitive extensions
const { coverImages, seriesImages } = importAllImages(
  require.context("../assets/images", true, /\.(webp|png|jpe?g|gif)$/i)
);

function Gallery() {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const openLightbox = (series) => {
    setSelectedSeries(series);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedSeries(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto';
  };

  const goToNext = () => {
    if (selectedSeries) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % seriesImages[selectedSeries].length
      );
    }
  };

  const goToPrevious = () => {
    if (selectedSeries) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + seriesImages[selectedSeries].length) % seriesImages[selectedSeries].length
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedSeries) {
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'Escape') closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedSeries]);

  return (
    <div className={GalleryCSS.container}>
      <Header />
      <div className={GalleryCSS.galleryGrid}>
        {Object.entries(coverImages).map(([seriesName, coverSrc], index) => (
          <motion.div
            key={seriesName}
            className={GalleryCSS.imageContainer}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openLightbox(seriesName)}
          >
            <div className={GalleryCSS.imageWrapper}>
              <img
                src={coverSrc}
                alt={`${galleryData[seriesName]?.title || seriesName}`}
                className={GalleryCSS.image}
                loading="lazy"
              />
              <div className={GalleryCSS.seriesTitle}>
                {galleryData[seriesName]?.title || seriesName}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedSeries && (
        <div className={GalleryCSS.lightbox} onClick={closeLightbox}>
          <div className={GalleryCSS.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={GalleryCSS.seriesInfo}>
              <h2>{galleryData[selectedSeries]?.title}</h2>
              <p>{galleryData[selectedSeries]?.description}</p>
            </div>
            <div className={GalleryCSS.imageSection}>
              <button 
                className={`${GalleryCSS.navButton} ${GalleryCSS.prevButton}`}
                onClick={goToPrevious}
              >
                &#10094;
              </button>
              <div className={GalleryCSS.lightboxImageWrapper}>
                <img
                  src={seriesImages[selectedSeries][currentImageIndex]}
                  alt={`${galleryData[selectedSeries]?.title} - Image ${currentImageIndex + 1}`}
                  className={GalleryCSS.lightboxImage}
                />
              </div>
              <button 
                className={`${GalleryCSS.navButton} ${GalleryCSS.nextButton}`}
                onClick={goToNext}
              >
                &#10095;
              </button>
            </div>
          </div>
          <button className={GalleryCSS.closeButton} onClick={closeLightbox}>
            ×
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Gallery; 
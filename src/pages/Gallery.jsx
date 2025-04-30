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
    console.log('Found series:', seriesName); // Debug log
    
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

  console.log('Gallery Data:', galleryData); // Debug log
  return { coverImages, seriesImages };
};

// Import all images with case-insensitive extensions
const { coverImages, seriesImages } = importAllImages(
  require.context("../assets/images", true, /\.(webp|png|jpe?g|gif)$/i)
);

function Gallery() {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMoreWorksExpanded, setIsMoreWorksExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Filter series for main gallery and more works
  const mainGallerySeries = Object.entries(coverImages).filter(([seriesName]) => 
    ['series1', 'series2', 'series3'].includes(seriesName)
  );
  const moreWorksSeries = Object.entries(coverImages).filter(([seriesName]) => 
    ['series4', 'series5', 'series6'].includes(seriesName)
  );
  
  const openLightbox = (series) => {
    console.log('Opening series:', series); // Debug log
    console.log('Gallery data for series:', galleryData[series]); // Debug log
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

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Only prevent default during the actual swipe
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      e.preventDefault(); // Prevent default only if it's a swipe
      goToNext();
    } else if (isRightSwipe) {
      e.preventDefault(); // Prevent default only if it's a swipe
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
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
        {mainGallerySeries.map(([seriesName, coverSrc], index) => (
          <motion.div
            key={seriesName}
            className={GalleryCSS.imageContainer}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8,
              delay: index * 0.2,
              ease: "easeOut"
            }}
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

      <div className={GalleryCSS.moreWorksSection}>
        <button 
          className={`${GalleryCSS.moreWorksToggle} ${isMoreWorksExpanded ? GalleryCSS.expanded : ''}`}
          onClick={() => setIsMoreWorksExpanded(!isMoreWorksExpanded)}
        >
          Additional Works
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={`${GalleryCSS.moreWorksContent} ${isMoreWorksExpanded ? GalleryCSS.expanded : ''}`}>
          <div className={GalleryCSS.galleryGrid}>
            {moreWorksSeries.map(([seriesName, coverSrc], index) => (
              <motion.div
                key={seriesName}
                className={GalleryCSS.imageContainer}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
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
        </div>
      </div>

      {selectedSeries && (
        <div className={GalleryCSS.lightbox} onClick={closeLightbox}>
          <div 
            className={GalleryCSS.lightboxContent} 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <div className={GalleryCSS.imageSection}>
              <div 
                className={`${GalleryCSS.navArea} ${GalleryCSS.prevArea}`}
                onClick={goToPrevious}
              />
              <div className={GalleryCSS.lightboxImageWrapper}>
                <img
                  src={seriesImages[selectedSeries][currentImageIndex]}
                  alt={`${galleryData[selectedSeries]?.title || selectedSeries} - Image ${currentImageIndex + 1}`}
                  className={GalleryCSS.lightboxImage}
                />
                <div className={GalleryCSS.positionIndicator}>
                  {currentImageIndex + 1} / {seriesImages[selectedSeries].length}
                </div>
              </div>
              <div 
                className={`${GalleryCSS.navArea} ${GalleryCSS.nextArea}`}
                onClick={goToNext}
              />
            </div>
            <div className={GalleryCSS.seriesInfo}>
              <h2>{galleryData[selectedSeries]?.title || selectedSeries}</h2>
              <p>{galleryData[selectedSeries]?.description}</p>
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
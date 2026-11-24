import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const { seriesName } = useParams();
  const navigate = useNavigate();
  const selectedSeries = seriesImages[seriesName] ? seriesName : null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Filter series for main gallery and more works
  const mainGallerySeries = Object.entries(coverImages).filter(([seriesName]) => 
    ['s1_fortress', 's2_cage', 's3_notalone'].includes(seriesName)
  );
  const moreWorksSeries = Object.entries(coverImages).filter(([seriesName]) => 
    ['s4_balance', 's13_happyfeet', 's5_egg', 's6_drowned', 's7_lift', 's9_puppeteer', 's8_seer'
    ].includes(seriesName)
  );
  const inProgressSeries = Object.entries(coverImages).filter(([seriesName]) =>
    ['s10_daydreamer', 's11_darkness'].includes(seriesName)
  );

  const openWork = useCallback((series) => {
    navigate(`/gallery/${series}`);
  }, [navigate]);

  const returnToGallery = useCallback(() => {
    navigate("/gallery");
  }, [navigate]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedSeries]);

  const renderMoreWorksStyleGrid = (entries, { eagerFirst = false } = {}) => (
    <div className={GalleryCSS.moreWorksGrid}>
      {entries.map(([seriesName, coverSrc], index) => (
        <motion.div
          key={seriesName}
          className={`${GalleryCSS.imageContainer} ${GalleryCSS.moreWorksItem}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: index * 0.2,
            ease: "easeOut"
          }}
          onClick={() => openWork(seriesName)}
        >
          <div className={GalleryCSS.imageWrapper}>
            <img
              src={coverSrc}
              alt={`${galleryData[seriesName]?.title || seriesName}`}
              className={GalleryCSS.image}
              loading={eagerFirst && index === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eagerFirst && index === 0 ? "high" : "low"}
            />
            {galleryData[seriesName]?.title && 
            (<div className={GalleryCSS.seriesTitle}>
              {galleryData[seriesName]?.title }
            </div>)}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const goToNext = useCallback(() => {
    if (selectedSeries) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % seriesImages[selectedSeries].length
      );
    }
  }, [selectedSeries]);

  const goToPrevious = useCallback(() => {
    if (selectedSeries) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + seriesImages[selectedSeries].length) % seriesImages[selectedSeries].length
      );
    }
  }, [selectedSeries]);

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
        if (e.key === 'Escape') returnToGallery();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedSeries, goToNext, goToPrevious, returnToGallery]);

  // Warm-cache prev/next lightbox slides so navigation stays instant
  useEffect(() => {
    if (!selectedSeries) return;
    const list = seriesImages[selectedSeries];
    if (!list?.length) return;

    const preload = (idx) => {
      if (idx < 0 || idx >= list.length) return;
      const img = new Image();
      img.decoding = "async";
      img.src = list[idx];
    };

    preload(currentImageIndex);
    preload((currentImageIndex + 1) % list.length);
    preload((currentImageIndex - 1 + list.length) % list.length);
  }, [selectedSeries, currentImageIndex]);

  return (
    <div className={GalleryCSS.container}>
      <Header />
      {selectedSeries ? (
        <main className={GalleryCSS.detailPage}>
          <Link className={GalleryCSS.backLink} to="/gallery">
            ← Back to Gallery
          </Link>
          <div 
            className={GalleryCSS.lightboxContent}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <div className={GalleryCSS.imageSection}>
              <button
                type="button"
                className={`${GalleryCSS.navArea} ${GalleryCSS.prevArea}`}
                onClick={goToPrevious}
                aria-label="Previous image"
              />
              <div className={GalleryCSS.lightboxImageWrapper}>
                <img
                  src={seriesImages[selectedSeries][currentImageIndex]}
                  alt={`${galleryData[selectedSeries]?.title || selectedSeries} (${currentImageIndex + 1})`}
                  className={GalleryCSS.lightboxImage}
                  decoding="async"
                  fetchPriority="high"
                />
                <div className={GalleryCSS.positionIndicator}>
                  {currentImageIndex + 1} / {seriesImages[selectedSeries].length}
                </div>
              </div>
              <button
                type="button"
                className={`${GalleryCSS.navArea} ${GalleryCSS.nextArea}`}
                onClick={goToNext}
                aria-label="Next image"
              />
            </div>
            <div className={GalleryCSS.seriesInfo}>
              <h1>{galleryData[selectedSeries]?.title || selectedSeries}</h1>
              {galleryData[selectedSeries]?.description && (
                <p>{galleryData[selectedSeries].description}</p>
              )}
            </div>
          </div>
        </main>
      ) : seriesName ? (
        <main className={GalleryCSS.detailPage}>
          <p>Work not found.</p>
          <Link className={GalleryCSS.backLink} to="/gallery">Back to Gallery</Link>
        </main>
      ) : (
        <div className={GalleryCSS.galleryColumn}>
          <div className={GalleryCSS.mainGallerySection}>
            {renderMoreWorksStyleGrid(mainGallerySeries, { eagerFirst: true })}
          </div>

          <div className={GalleryCSS.moreWorksSection}>
            {renderMoreWorksStyleGrid(moreWorksSeries)}
          </div>

          <div className={GalleryCSS.inProgressGallery}>
            <h2 className={GalleryCSS.moreWorksHeading}>In Progress</h2>
            {renderMoreWorksStyleGrid(inProgressSeries)}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Gallery;
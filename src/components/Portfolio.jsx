import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioCSS from "../css/Portfolio.module.css";
import { motion } from "framer-motion";
import data from "../Data";

// Dynamically import all images from the slideshow folder
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/slideshow", false, /\.(webp|png|jpe?g|gif)$/i)
);
const workImageContext = require.context(
  "../assets/images",
  true,
  /\.(webp|png|jpe?g|gif)$/i
);
const studiesFeatureImage = require("../assets/images/study_1_smile/cover.jpg");
let workImagePreloadStarted = false;

// Preload images for smoother transitions
const preloadImages = () => {
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

const preloadWorkImages = () => {
  if (workImagePreloadStarted || navigator.connection?.saveData) return;
  workImagePreloadStarted = true;

  const imagePaths = workImageContext.keys().sort((a, b) => {
    const aIsCover = a.toLowerCase().includes("cover.");
    const bIsCover = b.toLowerCase().includes("cover.");
    return Number(bIsCover) - Number(aIsCover);
  });
  let nextImageIndex = 0;

  const scheduleNextImage = () => {
    if (nextImageIndex >= imagePaths.length) return;

    const loadNextImage = () => {
      const img = new Image();
      img.fetchPriority = "low";
      img.decoding = "async";
      img.onload = scheduleNextImage;
      img.onerror = scheduleNextImage;
      img.src = workImageContext(imagePaths[nextImageIndex]);
      nextImageIndex += 1;
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadNextImage, { timeout: 2000 });
    } else {
      window.setTimeout(loadNextImage, 200);
    }
  };

  scheduleNextImage();
  scheduleNextImage();
};

function Portfolio() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Preload images on component mount
  useEffect(() => {
    preloadImages();
    preloadWorkImages();
  }, []);

  // Auto-rotate slideshow every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500); // Match CSS transition duration
    }
  };

  const handlePrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setIsTransitioning(false);
      }, 500); // Match CSS transition duration
    }
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    handlePrevious();
  };

  const goToNext = (e) => {
    e.stopPropagation();
    handleNext();
  };

  const handleDotClick = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleSlideClick = () => {
    navigate('/gallery');
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      <div className={PortfolioCSS.slideshowBackground}>
        <div 
          className={PortfolioCSS.slideshowContainer}
          onClick={handleSlideClick}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`${PortfolioCSS.navArea} ${PortfolioCSS.prevArea}`}
            onClick={goToPrevious}
          />
          
          <div className={PortfolioCSS.slideWrapper}>
            {images.map((src, index) => (
              <div 
                key={src}
                className={`${PortfolioCSS.imageWrapper} ${index === currentIndex ? PortfolioCSS.active : ''}`}
              >
                <img
                  src={src}
                  alt={`Portfolio ${index + 1}`}
                  className={PortfolioCSS.image}
                  draggable="false"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          <div 
            className={`${PortfolioCSS.navArea} ${PortfolioCSS.nextArea}`}
            onClick={goToNext}
          />
          
          <div className={PortfolioCSS.dotsContainer} onClick={e => e.stopPropagation()}>
            {images.map((_, index) => (
              <span
                key={index}
                className={`${PortfolioCSS.dot} ${index === currentIndex ? PortfolioCSS.activeDot : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(index);
                }}
              />
            ))}
          </div>

          <div className={PortfolioCSS.viewGalleryHint}>
            Click to view full gallery
          </div>
        </div>
      </div>

      <motion.div 
        className={PortfolioCSS.statementContainer}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={PortfolioCSS.statementContent}>
          <h2>{data.AboutHeading2}</h2>
          <div className={PortfolioCSS.statementText}>
            {data.AboutTextParagraph2}
          </div>
        </div>
      </motion.div>

      <div className={PortfolioCSS.studiesFeatureBackground}>
        <button
          type="button"
          className={PortfolioCSS.studiesFeature}
          onClick={() => navigate("/studies")}
          aria-label="View figure studies"
        >
          <img
            src={studiesFeatureImage}
            alt="Figure study"
            className={PortfolioCSS.image}
            loading="lazy"
            decoding="async"
          />
          <span className={PortfolioCSS.studiesFeatureLabel}>Figure Studies</span>
        </button>
      </div>
    </>
  );
}

export default Portfolio;

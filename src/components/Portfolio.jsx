import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioCSS from "../css/Portfolio.module.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import data from "../Data";

// Dynamically import all images from the slideshow folder
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/slideshow", false, /\.(webp|png|jpe?g|gif)$/i)
);

function Portfolio() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking navigation buttons
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking navigation buttons
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSlideClick = () => {
    navigate('/gallery');
  };

  return (
    <>
      <div 
        className={PortfolioCSS.slideshowContainer}
        onClick={handleSlideClick}
        style={{ cursor: 'pointer' }}
      >
        <button 
          className={`${PortfolioCSS.navButton} ${PortfolioCSS.prevButton}`}
          onClick={goToPrevious}
        >
          &#10094;
        </button>
        
        <div className={PortfolioCSS.slideWrapper}>
          <ImageWrapper src={images[currentIndex]} index={currentIndex} />
        </div>

        <button 
          className={`${PortfolioCSS.navButton} ${PortfolioCSS.nextButton}`}
          onClick={goToNext}
        >
          &#10095;
        </button>
        
        <div className={PortfolioCSS.dotsContainer} onClick={e => e.stopPropagation()}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${PortfolioCSS.dot} ${index === currentIndex ? PortfolioCSS.activeDot : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>

        <div className={PortfolioCSS.viewGalleryHint}>
          Click to view full gallery
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
    </>
  );
}

function ImageWrapper({ src, index }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeIn" }}
      className={PortfolioCSS.imageWrapper}
    >
      <img
        src={src}
        alt={`Portfolio ${index + 1}`}
        className={PortfolioCSS.image}
        draggable="false"
      />
    </motion.div>
  );
}

export default Portfolio;

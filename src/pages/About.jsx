import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutCSS from "../css/About.module.css";
import data from "../Data";

// Dynamically import the profile image
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/profile", false, /\.(webp|png|jpg|jpeg|gif)$/)
);

const profileImage = images.length > 0 ? images[0] : null;

function About() {
  const handleClick = () => {
    const email = data.AboutEmail;
    const subject = data.AboutEmailSubject;
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    emailLink.click();
  };

  return (
    <div className={AboutCSS.container}>
      <Header />
      <div className={AboutCSS.content}>
        <div className={AboutCSS.imageWrapper}>
          {profileImage && (
            <img
              src={profileImage}
              alt="Artist's Profile"
              className={AboutCSS.image}
            />
          )}
        </div>
        <div className={AboutCSS.textWrapper}>
          <h1>{data.AboutHeading}</h1>
          <p>{data.AboutTextParagraph1}</p>
          <div className={AboutCSS.contactInfo}>
            <a 
              href={`https://instagram.com/${data.InstagramHandle}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={AboutCSS.socialLink}
            >
              Instagram
            </a>
            <span className={AboutCSS.divider}>•</span>
            <a 
              href={`mailto:${data.AboutEmail}`} 
              className={AboutCSS.socialLink}
            >
              {data.AboutEmail}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;

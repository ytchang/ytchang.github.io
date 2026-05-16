import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutCSS from "../css/About.module.css";
import data from "../Data";

// Dynamically import the profile image
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/profile", false, /\.(webp|png|jpe?g|JPG|gif)$/i)
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
          <div className={"cv"}>
          <h1>CV</h1>
            <h2>Exhibitions</h2>
            <p>
            2026   ICON (Juried Exhibition) —  <b>Strong Voice in Art Award</b>, Lynn Hanson Gallery, Seattle, WA<br />
            2026   BOLD HERITAGE (Invitational Group Exhibition), SlipStitch Studio, Seattle, WA<br />
            2026   PUBLIC/PRIVATE (Juried Exhibition), SlipStitch Studio, Seattle, WA<br />
            2025   Visual Impressions (Juried Exhibition), Ryan James Fine Arts, Kirkland, WA<br />
            </p>
            <h2>Early Showcases</h2>
            <p>
            2012–2014   Wonder Festival (International Character Sculpture Event), Tokyo, Japan<br />
            </p>
            {/*<h2>Education & Training</h2>*/}
            {/*<p>*/}
            {/*2025   Experimental Approaches to Color – Zoey Frank (Online)<br />*/}
            {/*2024   Character Design (Auditing) – Peter Mohrbacher (Online)<br />*/}
            {/*2021–2023   Online Sculpture Practicum – Mike Magrath, Gage Academy of Art<br />*/}
            {/*2021   Strange Encounters (Ceramic Sculpture Workshop) – Alessandro Gallo, Gage Academy of Art<br />*/}
            {/*2018   Sculpting Expressive Faces – Tip Toland, Gage Academy of Art<br />*/}
            {/*2014–2016   Fine Art Coursework: Life-Size Sculpture, Metal & Jewelry, Ceramics 101, University of Michigan<br />*/}
            {/*</p>*/}
            <h2>Academic Background</h2>
            <p>
            2014–2017   M.S. in Mechanical & Electrical Engineering, University of Michigan, Ann Arbor, MI<br />
            2010–2014   B.S. in Mechanical Engineering, National Taiwan University, Taipei, Taiwan<br />
            </p>
          </div>
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

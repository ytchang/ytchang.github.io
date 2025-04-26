import React from "react";
import FooterCSS from "../css/Footer.module.css";
import data from "../Data";

function Footer() {
  return (
    <footer className={FooterCSS.footer}>
      <div className={FooterCSS.container}>
        <p>{data.FooterText}</p>
        <p style={{ marginTop: "5px", fontSize: "12px" }}>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

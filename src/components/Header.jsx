import React, { useState } from 'react';
import '../styles/header.css';
import TataLogo from '../media/tata-motors.svg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHamburgerClick = () => setMenuOpen((open) => !open);

  return (
    <header className="main-header">
      <div className="logo">
        <img src={TataLogo} alt="Tata Motors Logo" className="logo-img" />
      </div>
      <div
        className="hamburger"
        onClick={handleHamburgerClick}
        aria-label="Toggle navigation"
        tabIndex={0}
        role="button"
      >
        <span />
        <span />
        <span />
      </div>
      <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
        <a href="#">Home</a>
        <a href="#">Cars</a>
        <a href="#">Trucks</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  );
};

export default Header;

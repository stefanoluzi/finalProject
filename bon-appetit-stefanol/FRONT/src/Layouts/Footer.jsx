

import React, { useState } from 'react';
import { TermsAndConditions } from '../Components/Terminos/TermsAndConditions';
import '../Components/Terminos/TermsAndConditions.css';

export const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  const handleOpenTerms = () => {
    setShowTerms(true);
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  return (
    <>
      <footer>
        <div className='footer-content'>
          <div className='footer-left'>
            <img className='footer-logo-large' src="../../public/Images/logo.png" alt='BonAppetit-logo' />
            <p className='footer-text'>Bon Appetit</p>
            <div className='footer-socials'>
              <img className='footer-logo' src="../../public/Images/facebook-logo.png" alt='Facebook-logo' />
              <img className='footer-logo' src="../../public/Images/linkedin-logo.png" alt='LinkedIn-logo' />
              <img className='footer-logo' src="../../public/Images/x-logo.png" alt='X-logo' />
              <img className='footer-logo' src="../../public/Images/instagram-logo.png" alt='Instagram-logo' />
            </div>
          </div>
          
          <div className='footer-right'>
            <div className='footer-lists'>
              <ul className='footer-list'>
                <li>CREAR USUARIO</li>
                <li>CHEFS DE LA CASA</li>
                <li>BONAPPETIT PREMIUM</li>
                <li>DONACIONES</li>
              </ul>
              <ul className='footer-list'>
                <li>AYUDA</li>
                <li>INVERSIONISTAS</li>
                <li>NOVEDADES</li>
                <li>NUTRICIONISTAS</li>
              </ul>
            </div>
            <hr className='footer-divider' />
            <div className='footer-ingredients'>
              <p>Ingredientes: Exequiel Godoy, Francisco Heredia, Hernan Suarez, Jana Roguin, Martin Cinalli, Wilfren Pereira, Stefano Luzi, Franco Lopez</p>
            </div>
          </div>
        </div>
        <hr className='footer-horizontal-line' />
        <div className='footer-additional'>
            <p>©2024 Bon Appetit, Inc. | <a href='#' onClick={handleOpenTerms}>Términos</a> | <a href='#'>Privacidad</a> | <a href='#'>Mapa del sitio</a></p>
        </div>
      </footer>
      {showTerms && <TermsAndConditions onClose={handleCloseTerms} />}
    </>
  );
};

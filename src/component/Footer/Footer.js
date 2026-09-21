import React from 'react'
import { Link } from 'react-router-dom';
import './footer.css'
import JouliaMark from '../Logo/Logo';
import { useLanguage } from '../../i18n/LanguageContext';

function Footer() {
    const year = new Date().getFullYear();
    const { t } = useLanguage();

    return (
        <footer className='site-footer'>
            <div className='container footer-grid'>
                <div className='footer-col'>
                    <h4 className='footer-brand'>
                        <JouliaMark size={30} />
                        <span>{t('brand.first')} <em>{t('brand.second')}</em></span>
                    </h4>
                    <p className='footer-about'>
                        {t('footer.about')}
                    </p>
                    <div className='footer-socials'>
                        <a href='https://facebook.com' target='_blank' rel='noreferrer' aria-label='Facebook'><i className='fa-brands fa-facebook'></i></a>
                        <a href='https://instagram.com' target='_blank' rel='noreferrer' aria-label='Instagram'><i className='fa-brands fa-instagram'></i></a>
                        <a href='https://twitter.com' target='_blank' rel='noreferrer' aria-label='Twitter'><i className='fa-brands fa-twitter'></i></a>
                    </div>
                </div>

                <div className='footer-col'>
                    <h5>{t('footer.quickLinks')}</h5>
                    <ul className='footer-links'>
                        <li><Link to='/'>{t('nav.menu')}</Link></li>
                        <li><Link to='/offers'>{t('nav.offers')}</Link></li>
                        <li><Link to='/about'>{t('footer.aboutUs')}</Link></li>
                        <li><Link to='/contact'>{t('footer.contactUs')}</Link></li>
                    </ul>
                </div>

                <div className='footer-col'>
                    <h5>{t('footer.account')}</h5>
                    <ul className='footer-links'>
                        <li><Link to='/login'>{t('footer.login')}</Link></li>
                        <li><Link to='/register'>{t('footer.register')}</Link></li>
                        <li><Link to='/cart'>{t('footer.myCart')}</Link></li>
                        <li><Link to='/order-tracking'>{t('footer.trackOrder')}</Link></li>
                    </ul>
                </div>

                <div className='footer-col'>
                    <h5>{t('footer.contact')}</h5>
                    <ul className='footer-links footer-contact'>
                        <li><i className='fa-solid fa-location-dot'></i> {t('footer.address')}</li>
                        <li><i className='fa-solid fa-phone'></i> <bdi dir='ltr'>+31 6 1234 5678</bdi></li>
                        <li><i className='fa-solid fa-envelope'></i> <bdi dir='ltr'>hello@joulia-restaurant.com</bdi></li>
                    </ul>
                </div>
            </div>

            <div className='footer-bottom'>
                <p className='mb-0'>{t('footer.rights', { year, brand: t('brand.full') })}</p>
            </div>
        </footer>
    )
}

export default Footer

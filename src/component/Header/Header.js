import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./header.css"
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../redux/feature/authSlice';
import JouliaMark from '../Logo/Logo';
import { useLanguage } from '../../i18n/LanguageContext';
import { LANGUAGES } from '../../i18n/translations';

function Header() {

  const { cart } = useSelector((state) => state.allCart);
  const { currentUser } = useSelector((state) => state.allAuth);
  const itemCount = cart.reduce((sum, item) => sum + item.qnty, 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useLanguage();

  // the button always offers the language you are NOT currently using
  const otherLang = lang === 'en' ? 'ar' : 'en';

  const handleLogout = () => {
    dispatch(logout());
    toast.success(t('toast.loggedOut'));
    navigate('/');
  }

  return (
    <Navbar className="site-header sticky-top" expand="lg" collapseOnSelect>
      <Container className="header-bar">

        <Navbar.Brand as={NavLink} to="/" className="brand-link" aria-label={t('header.home')}>
          <JouliaMark size={30} />
          <span className="brand-text">{t('brand.first')} <em>{t('brand.second')}</em></span>
        </Navbar.Brand>

        {/* cart sits outside the collapse so it stays reachable on mobile */}
        <div className="header-actions order-lg-3">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
            aria-label={t('lang.switchTo')}
            title={t('lang.switchTo')}
          >
            <i className="fa-solid fa-globe" aria-hidden="true"></i>
            <span lang={otherLang}>{LANGUAGES[otherLang].label}</span>
          </button>

          <NavDropdown
            align="end"
            title={currentUser ? t('header.hi', { name: currentUser.name.split(' ')[0] }) : t('header.account')}
            id="account-dropdown"
            className="account-dropdown"
          >
            {currentUser
              ? <>
                <NavDropdown.Item as={NavLink} to="/order-tracking">{t('header.myOrders')}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>{t('header.logout')}</NavDropdown.Item>
              </>
              : <>
                <NavDropdown.Item as={NavLink} to="/login">{t('header.login')}</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/register">{t('header.signup')}</NavDropdown.Item>
              </>
            }
          </NavDropdown>

          <NavLink to="/cart" className="cart-button" aria-label={t('header.cartAria', { count: itemCount })}>
            <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>
            {itemCount > 0 && <span key={itemCount} className="cart-count">{itemCount}</span>}
          </NavLink>

          <Navbar.Toggle aria-controls="main-nav" className="nav-toggle" />
        </div>

        <Navbar.Collapse id="main-nav" className="order-lg-2">
          <Nav className="nav-links">
            <NavLink to="/" end className="nav-link-item">{t('nav.menu')}</NavLink>
            <NavLink to="/offers" className="nav-link-item">{t('nav.offers')}</NavLink>
            <NavLink to="/about" className="nav-link-item">{t('nav.about')}</NavLink>
            <NavLink to="/contact" className="nav-link-item">{t('nav.contact')}</NavLink>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  )
}

export default Header

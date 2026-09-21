import React, { useEffect, useMemo, useState } from 'react'
import CardsData from './../../data/CardData'
import Form from 'react-bootstrap/Form';
import './home.css'
import { useDispatch } from 'react-redux';

import { addToCart } from '../../redux/feature/cartSlice';
import toast from 'react-hot-toast';
import CustomizeModal from '../CustomizeModal/CustomizeModal';
import SkeletonCard from '../Skeleton/SkeletonCard';
import Hero from '../Hero/Hero';
import { useLanguage } from '../../i18n/LanguageContext';

const FILTERS = ['All', 'Top Rated', 'Vegetarian', 'Best Seller'];

function Home() {
  const dispatch = useDispatch();
  const { t, tv, dishName, cuisines } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // simulate a network fetch so the skeleton loaders have something to show -
  // swap this for a real API call when the menu is served from a backend
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(CardsData.map((item) => item.category))];
    return ['All', ...unique];
  }, []);

  const visibleItems = useMemo(() => {
    return CardsData.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        item.dish.toLowerCase().includes(query) ||
        dishName(item).toLowerCase().includes(query);

      let matchesFilter = true;
      if (activeFilter === 'Top Rated') matchesFilter = parseFloat(item.rating) >= 4.0;
      if (activeFilter === 'Vegetarian') matchesFilter = item.veg === true;
      if (activeFilter === 'Best Seller') matchesFilter = item.bestSeller === true;

      return matchesCategory && matchesSearch && matchesFilter;
    });
  }, [search, activeCategory, activeFilter, dishName]);

  const openCustomize = (item) => {
    setModalItem(item);
    setShowModal(true);
  }

  const handleConfirmAdd = (cartLine) => {
    dispatch(addToCart(cartLine));
    toast.success(t('toast.addedToCart', { dish: dishName(cartLine) }));
  }

  return (
    <>
      <Hero />

      <section id='menu' className='menu-section'>
        <div className='page-shell'>

          <div className='section-heading'>
            <h2>{t('home.title')}</h2>
            <p>{t('home.count', { count: visibleItems.length })}</p>
          </div>

          {/* category tabs - stick under the header while scrolling */}
          <div className='menu-toolbar'>
            <div className='category-bar' role='tablist' aria-label={t('home.categoriesAria')}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type='button'
                  role='tab'
                  aria-selected={activeCategory === cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {tv('cat', cat)}
                </button>
              ))}
            </div>

            <div className='search-filter-bar'>
              <Form.Control
                type='search'
                placeholder={t('home.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='search-input'
                aria-label={t('home.searchPlaceholder')}
              />
              <Form.Select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className='filter-select'
                aria-label={t('home.filterAria')}
              >
                {FILTERS.map((f) => (
                  <option key={f} value={f}>{tv('filter', f)}</option>
                ))}
              </Form.Select>
            </div>
          </div>

          <div className='menu-grid'>
            {
              loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : visibleItems.length === 0
                  ? <p className='no-results'>
                    {t('home.noResults')}
                  </p>
                  : visibleItems.map((element) => (
                    <article
                      key={element.id}
                      className='dish-card'
                      onClick={() => openCustomize(element)}
                    >
                      <div className='dish-media'>
                        <img src={element.imgdata} className='dish-img' alt={dishName(element)} loading='lazy' />
                        {element.bestSeller && <span className='dish-flag'>{t('home.bestSeller')}</span>}
                      </div>

                      <div className='dish-body'>
                        <div className='dish-top'>
                          <h3 className='dish-name'>{dishName(element)}</h3>
                          <span className='dish-rating'>
                            <i className='fa-solid fa-star' aria-hidden='true'></i>
                            {element.rating}
                          </span>
                        </div>

                        <p className='dish-meta'>{cuisines(element.address)}</p>

                        <div className='dish-tags'>
                          <span className={`diet-dot ${element.veg ? 'veg' : 'non-veg'}`}>
                            {element.veg ? t('home.vegetarian') : t('home.containsMeat')}
                          </span>
                          <span className='dish-cat'>{tv('cat', element.category)}</span>
                        </div>

                        <div className='dish-foot'>
                          <span className='dish-price'><bdi dir='ltr'>${element.price}</bdi></span>
                          <button
                            type='button'
                            className='btn btn-solid add-btn'
                            onClick={(e) => { e.stopPropagation(); openCustomize(element); }}
                          >
                            {t('home.addToCart')}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
            }
          </div>

        </div>
      </section>

      <CustomizeModal
        show={showModal}
        item={modalItem}
        onHide={() => setShowModal(false)}
        onConfirm={handleConfirmAdd}
      />
    </>
  )
}

export default Home

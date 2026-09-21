import React from 'react'
import './pages.css'
import { useLanguage } from '../../i18n/LanguageContext';

// `id` maps to offers.<id>.title / offers.<id>.desc in i18n/translations.js
const OFFERS = [
    { id: 'save10', code: 'SAVE10' },
    { id: 'welcome15', code: 'WELCOME15' },
    { id: 'delivery', code: null },
];

function Offers() {
    const { t } = useLanguage();

    return (
        <div className='container static-page'>
            <h3>{t('offers.title')}</h3>
            <p className='page-lede'>
                {t('offers.lede')}
            </p>

            <div className='row g-3'>
                {OFFERS.map((offer) => (
                    <div className='col-md-4' key={offer.id}>
                        <div className='offer-card'>
                            {offer.code && <span className='offer-code'>{offer.code}</span>}
                            <h5>{t(`offers.${offer.id}.title`)}</h5>
                            <p>{t(`offers.${offer.id}.desc`)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Offers

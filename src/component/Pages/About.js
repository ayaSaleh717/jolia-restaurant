import React from 'react'
import './pages.css'
import { useLanguage } from '../../i18n/LanguageContext';

function About() {
    const { t } = useLanguage();

    return (
        <div className='container static-page'>
            <h3>{t('about.title')}</h3>
            <p className='page-lede'>
                {t('about.lede')}
            </p>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
        </div>
    )
}

export default About

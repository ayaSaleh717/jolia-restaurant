import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import './hero.css'
import { useLanguage } from '../../i18n/LanguageContext';

// Local videos from public/videos folder
const VIDEO_SOURCES = [
    { src: 'https://res.cloudinary.com/dbn8jdg2n/video/upload/v2.mp4', type: 'video/mp4' },
    { src: 'https://res.cloudinary.com/dbn8jdg2n/video/upload/v1.mp4', type: 'video/mp4' },
];

// text for these lives in i18n/translations.js (hero.fact1.value, ...)
const FACT_KEYS = ['hero.fact1', 'hero.fact2', 'hero.fact3'];

function Hero() {
    const { t } = useLanguage();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoFailed, setVideoFailed] = useState(false);
    const videoRef = useRef(null);

    // Auto-switch videos every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEO_SOURCES.length);
        }, 10000); // Switch every 10 seconds

        return () => clearInterval(interval);
    }, []);

    // Ensure video plays when it loads or when source changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Video autoplay was prevented:', error);
                });
            }
        }
    }, [currentVideoIndex]);

    const handleVideoError = () => setVideoFailed(true);

    return (
        <section className='hero-section'>
            <div className='hero-inner'>

                {/* ---- copy: left ---- */}
                <div className='hero-copy'>
                    <span className='hero-kicker'>{t('hero.kicker')}</span>

                    <h1 className='hero-title'>
                        {t('hero.title1')}<br />
                        <em>{t('hero.title2')}</em>
                    </h1>

                    <p className='hero-text'>
                        {t('hero.text')}
                    </p>

                    <div className='hero-actions'>
                        <a href='#menu' className='hero-btn-primary'>{t('hero.browse')}</a>
                        <Link to='/about' className='hero-btn-secondary'>{t('hero.story')}</Link>
                    </div>

                    <dl className='hero-facts'>
                        {FACT_KEYS.map((key) => (
                            <div className='hero-fact' key={key}>
                                <dt><bdi>{t(`${key}.value`)}</bdi></dt>
                                <dd>{t(`${key}.label`)}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* ---- video: right ---- */}
                <div className='hero-media'>
                    {videoFailed
                        ? <div className='hero-media-fallback' />
                        : <video
                            key={currentVideoIndex}
                            ref={videoRef}
                            className='hero-video'
                            src={VIDEO_SOURCES[currentVideoIndex].src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            onError={handleVideoError}
                        />
                    }
                </div>

            </div>
        </section>
    )
}

export default Hero

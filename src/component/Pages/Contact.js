import React, { useState } from 'react'
import toast from 'react-hot-toast';
import './pages.css'
import { useLanguage } from '../../i18n/LanguageContext';

function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const { t } = useLanguage();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error(t('toast.contactMissing'));
            return;
        }
        toast.success(t('toast.contactSent'));
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className='container static-page'>
            <h3>{t('contact.title')}</h3>
            <p className='page-lede'>
                {t('contact.lede')}
            </p>

            <div className='contact-layout'>
                <form className='contact-form' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='form-label' htmlFor='contact-name'>{t('contact.name')}</label>
                        <input id='contact-name' className='form-control' name='name' value={form.name} onChange={handleChange} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label' htmlFor='contact-email'>{t('common.email')}</label>
                        <input id='contact-email' type='email' dir='ltr' className='form-control' name='email' value={form.email} onChange={handleChange} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label' htmlFor='contact-message'>{t('contact.message')}</label>
                        <textarea id='contact-message' className='form-control' rows={5} name='message' value={form.message} onChange={handleChange} />
                    </div>
                    <button type='submit' className='btn btn-solid'>{t('contact.send')}</button>
                </form>

                <aside className='contact-aside'>
                    <h5>{t('contact.reach')}</h5>
                    <ul>
                        <li><i className='fa-solid fa-location-dot' aria-hidden='true'></i> {t('footer.address')}</li>
                        <li><i className='fa-solid fa-phone' aria-hidden='true'></i> <bdi dir='ltr'>+31 6 1234 5678</bdi></li>
                        <li><i className='fa-solid fa-envelope' aria-hidden='true'></i> <bdi dir='ltr'>hello@joulia-restaurant.com</bdi></li>
                        <li><i className='fa-solid fa-clock' aria-hidden='true'></i> {t('contact.hours')}</li>
                    </ul>
                </aside>
            </div>
        </div>
    )
}

export default Contact

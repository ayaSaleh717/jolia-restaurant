import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './checkout.css';
import { placeOrder } from '../../redux/feature/orderSlice';
import { emptycartIteam, clearPromo } from '../../redux/feature/cartSlice';
import { computeTotals } from '../../utils/pricing';
import { useLanguage } from '../../i18n/LanguageContext';
import Money from '../../i18n/Money';

// built per language so validation messages are translated
const buildSchema = (t) => yup.object({
    name: yup.string().trim().min(3, t('val.name.min3')).required(t('val.name.required')),
    phone: yup.string().trim()
        .matches(/^[0-9+\s-]{8,15}$/, t('val.phone.invalid'))
        .required(t('val.phone.required')),
    address: yup.string().trim().min(5, t('val.address.min')).required(t('val.address.required')),
}).required();

const DEFAULT_COORDS = { lat: 52.3676, lng: 4.9041 }; // Amsterdam - used as the default map center

function Checkout() {
    const { cart, promo } = useSelector((state) => state.allCart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, lang, tv, dishName } = useLanguage();
    const schema = useMemo(() => buildSchema(t), [t]);

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [coords, setCoords] = useState(DEFAULT_COORDS);
    const [locating, setLocating] = useState(false);

    const { register, handleSubmit, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    // re-run validation for fields that are already showing an error so the
    // message switches language together with the rest of the page
    useEffect(() => {
        const failing = Object.keys(errors);
        if (failing.length) trigger(failing);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);

    const totals = computeTotals(cart, promo);

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            toast.error(t('toast.noGeolocation'));
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCoords({ lat: latitude, lng: longitude });
                setValue('address', t('checkout.pinned', { coords: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }), { shouldValidate: true });
                setLocating(false);
            },
            () => {
                toast.error(t('toast.locationFailed'));
                setLocating(false);
            }
        );
    };

    const onSubmit = (data) => {
        if (cart.length === 0) {
            toast.error(t('toast.cartIsEmpty'));
            return;
        }

        dispatch(placeOrder({
            customerName: data.name,
            phone: data.phone,
            address: data.address,
            paymentMethod,
            items: cart,
            promo,
            ...totals,
        }));
        dispatch(emptycartIteam());
        dispatch(clearPromo());
        toast.success(t('toast.orderPlaced'));
        navigate('/order-tracking');
    };

    if (cart.length === 0) {
        return (
            <div className='container text-center py-5'>
                <h4>{t('checkout.emptyTitle')}</h4>
                <p className='text-muted'>{t('checkout.emptyText')}</p>
                <Link to='/' className='btn checkout-btn'>{t('common.backToMenu')}</Link>
            </div>
        )
    }

    return (
        <div className='container checkout-page py-4'>
            <h3 className='mb-4'>{t('checkout.title')}</h3>
            <div className='row'>
                <div className='col-md-7'>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className='mb-3'>
                            <label className='form-label'>{t('common.fullName')}</label>
                            <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register('name')} />
                            {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>{t('checkout.phone')}</label>
                            <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`} dir='ltr' {...register('phone')} placeholder={t('checkout.phonePlaceholder')} />
                            {errors.phone && <div className='invalid-feedback'>{errors.phone.message}</div>}
                        </div>

                        <div className='mb-2'>
                            <label className='form-label d-flex justify-content-between align-items-center'>
                                <span>{t('checkout.address')}</span>
                                <button type='button' className='btn btn-sm btn-outline-secondary' onClick={useMyLocation} disabled={locating}>
                                    {locating ? t('checkout.locating') : t('checkout.useLocation')}
                                </button>
                            </label>
                            <textarea className={`form-control ${errors.address ? 'is-invalid' : ''}`} rows={2} {...register('address')} placeholder={t('checkout.addressPlaceholder')} />
                            {errors.address && <div className='invalid-feedback'>{errors.address.message}</div>}
                        </div>

                        <div className='map-preview mb-4'>
                            <iframe
                                title={t('checkout.mapTitle')}
                                width='100%'
                                height='220'
                                style={{ border: 0, borderRadius: '8px' }}
                                loading='lazy'
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.02}%2C${coords.lng + 0.02}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                            />
                            <small className='text-muted d-block mt-1'>{t('checkout.mapHint')}</small>
                        </div>

                        <div className='mb-4'>
                            <label className='form-label d-block'>{t('checkout.payment')}</label>
                            <div className='form-check'>
                                <input className='form-check-input' type='radio' id='pay-cod' checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                <label className='form-check-label' htmlFor='pay-cod'>{t('checkout.payCod')}</label>
                            </div>
                            <div className='form-check'>
                                <input className='form-check-input' type='radio' id='pay-card' checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                <label className='form-check-label' htmlFor='pay-card'>{t('checkout.payCard')}</label>
                            </div>
                        </div>

                        <button type='submit' className='btn checkout-btn w-100' disabled={isSubmitting}>
                            {t('checkout.place')} &middot; <Money value={totals.total} />
                        </button>
                    </form>
                </div>

                <div className='col-md-5'>
                    <div className='order-review'>
                        <h5 className='mb-3'>{t('checkout.summary')}</h5>
                        {cart.map((item) => (
                            <div key={item.id} className='review-line'>
                                <span>{item.qnty} &times; {dishName(item)} {item.size ? `(${tv('size', item.size)})` : ''}</span>
                                <span><Money value={item.price * item.qnty} /></span>
                            </div>
                        ))}
                        <div className='order-summary mt-3'>
                            <div className='summary-line'><span>{t('common.subtotal')}</span><span><Money value={totals.subtotal} /></span></div>
                            <div className='summary-line'><span>{t('common.deliveryFee')}</span><span>{totals.deliveryFee === 0 ? t('common.free') : <Money value={totals.deliveryFee} />}</span></div>
                            {promo && <div className='summary-line text-success'><span>{t('common.discount')}</span><span><Money value={totals.discount} negative /></span></div>}
                            <div className='summary-line total-line'><span>{t('common.total')}</span><span><Money value={totals.total} /></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './tracking.css';
import { advanceOrderStatus } from '../../redux/feature/orderSlice';
import { useLanguage } from '../../i18n/LanguageContext';
import Money from '../../i18n/Money';

// `key` maps to tracking.stage.<key> in i18n/translations.js
const STAGES = [
    { key: 'received', icon: 'fa-receipt' },
    { key: 'preparing', icon: 'fa-utensils' },
    { key: 'driver', icon: 'fa-motorcycle' },
    { key: 'delivered', icon: 'fa-house' },
];

// how long each stage "takes" in this demo, in milliseconds
const STAGE_DURATION = 6000;

function Tracking() {
    const { lastOrder } = useSelector((state) => state.allOrder);
    const dispatch = useDispatch();
    const { t, tv, dishName } = useLanguage();

    // simulate the order moving through each stage automatically -
    // swap this for real status updates (websocket/polling) against a backend
    useEffect(() => {
        if (!lastOrder || lastOrder.status >= STAGES.length - 1) return;
        const timer = setTimeout(() => dispatch(advanceOrderStatus()), STAGE_DURATION);
        return () => clearTimeout(timer);
    }, [lastOrder, dispatch]);

    if (!lastOrder) {
        return (
            <div className='container text-center py-5'>
                <h4>{t('tracking.noOrder')}</h4>
                <p className='text-muted'>{t('tracking.noOrderText')}</p>
                <Link to='/' className='btn checkout-btn'>{t('common.backToMenu')}</Link>
            </div>
        )
    }

    const { status } = lastOrder;

    return (
        <div className='container tracking-page py-4'>
            <h3 className='mb-1'>{t('tracking.title')}</h3>
            <p className='text-muted'>{t('tracking.placedFor', { name: lastOrder.customerName })} &middot; {lastOrder.paymentMethod === 'cod' ? t('common.cashOnDelivery') : t('tracking.card')}</p>

            <div className='stepper mt-4 mb-5'>
                {STAGES.map((stage, index) => (
                    <div key={stage.key} className={`stepper-item ${index <= status ? 'done' : ''} ${index === status ? 'current' : ''}`}>
                        <div className='stepper-circle'><i className={`fa-solid ${stage.icon}`}></i></div>
                        <span className='stepper-label'>{t(`tracking.stage.${stage.key}`)}</span>
                        {index < STAGES.length - 1 && <div className={`stepper-line ${index < status ? 'done' : ''}`} />}
                    </div>
                ))}
            </div>

            <div className='row'>
                <div className='col-md-7'>
                    <div className='order-review mb-3'>
                        <h5 className='mb-3'>{t('tracking.deliveringTo')}</h5>
                        <p className='mb-1'><bdi>{lastOrder.address}</bdi></p>
                        <p className='text-muted mb-0'><bdi dir='ltr'>{lastOrder.phone}</bdi></p>
                    </div>
                    <div className='order-review'>
                        <h5 className='mb-3'>{t('tracking.items')}</h5>
                        {lastOrder.items.map((item) => (
                            <div key={item.id} className='review-line'>
                                <span>{item.qnty} &times; {dishName(item)} {item.size ? `(${tv('size', item.size)})` : ''}</span>
                                <span><Money value={item.price * item.qnty} /></span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='col-md-5'>
                    <div className='order-review'>
                        <h5 className='mb-3'>{t('tracking.orderTotal')}</h5>
                        <div className='order-summary'>
                            <div className='summary-line'><span>{t('common.subtotal')}</span><span><Money value={lastOrder.subtotal} /></span></div>
                            <div className='summary-line'><span>{t('common.deliveryFee')}</span><span>{lastOrder.deliveryFee === 0 ? t('common.free') : <Money value={lastOrder.deliveryFee} />}</span></div>
                            {lastOrder.discount > 0 && <div className='summary-line text-success'><span>{t('common.discount')}</span><span><Money value={lastOrder.discount} negative /></span></div>}
                            <div className='summary-line total-line'><span>{t('common.total')}</span><span><Money value={lastOrder.total} /></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tracking

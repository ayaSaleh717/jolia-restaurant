import React, { useState } from 'react'
import "./card.css"
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeToCart, removeSingleIteams, emptycartIteam, applyPromo, clearPromo } from './../../redux/feature/cartSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { computeTotals, PROMO_CODES } from '../../utils/pricing';
import { useLanguage } from '../../i18n/LanguageContext';
import Money from '../../i18n/Money';

const CartDetails = () => {

    const { cart, promo } = useSelector((state) => state.allCart);

    const [promoInput, setPromoInput] = useState('');

    const dispatch = useDispatch();
    const { t, tv, dishName } = useLanguage();

    // add to cart
    const handleIncrement = (e) => {
        dispatch(addToCart(e))
    }

    // remove to cart
    const handleDecrement = (e) => {
        dispatch(removeToCart(e));
        toast.success(t('toast.itemRemoved'))
    }

    // remove single item 
    const handleSingleDecrement = (e) => {
        dispatch(removeSingleIteams(e))
    }

    // empty cart
    const emptycart = () => {
        dispatch(emptycartIteam())
        dispatch(clearPromo())
        toast.success(t('toast.cartEmptied'))

    }

    // totals are derived from the cart on every render - no effect/state needed
    const totalprice = cart.reduce((sum, ele) => sum + ele.price * ele.qnty, 0)
    const totalquantity = cart.reduce((sum, ele) => sum + ele.qnty, 0)

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (!code) return;

        if (PROMO_CODES[code]) {
            dispatch(applyPromo({ code, percent: PROMO_CODES[code] }));
            toast.success(t('toast.promoApplied', { percent: PROMO_CODES[code] }));
        } else {
            toast.error(t('toast.promoInvalid'));
        }
    }

    const handleRemovePromo = () => {
        dispatch(clearPromo());
        setPromoInput('');
    }

    const { deliveryFee, discount, total: grandTotal } = computeTotals(cart, promo);

    return (
        <>
            <div className='row justify-content-center m-0'>
                <div className='col-md-8 mt-5 mb-5 cardsdetails'>
                    <div className="card">
                        <div className="card-header  p-3">
                            <div className='card-header-flex'>
                                <h5 className='text-dark m-0'>{t('cart.title')}{cart.length > 0 ? ` (${cart.length})` : ""}</h5>
                                {
                                    cart.length > 0 ? <button className='btn btn-danger mt-0 btn-sm'
                                        onClick={emptycart}
                                    ><i className='fa fa-trash-alt mr-2'></i><span>{t('cart.emptyButton')}</span></button>
                                        : ""
                                }
                            </div>

                        </div>
                        <div className="card-body p-0">
                            {
                                cart.length === 0 ? <table className='table cart-table mb-0'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={6}>
                                                <div className='cart-empty'>
                                                    <i className='fa fa-shopping-cart'></i>
                                                    <p>{t('cart.empty')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> :
                                    <table className='table cart-table mb-0 table-responsive-sm'>
                                        <thead>
                                            <tr>
                                                <th>{t('cart.colAction')}</th>
                                                <th>{t('cart.colProduct')}</th>
                                                <th>{t('cart.colName')}</th>
                                                <th>{t('cart.colPrice')}</th>
                                                <th>{t('cart.colQty')}</th>
                                                <th className='text-right'> <span id="amount" className='amount'>{t('cart.colTotal')}</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cart.map((data, index) => {
                                                    return (
                                                        <tr key={data.id}>
                                                            <td>
                                                                <button className='prdct-delete'
                                                                    onClick={() => handleDecrement(data.id)}
                                                                ><i className='fa fa-trash-alt'></i></button>
                                                            </td>
                                                            <td><div className='product-img'><img src={data.imgdata} alt="" /></div></td>
                                                            <td>
                                                                <div className='product-name'>
                                                                    <p className='mb-0'>{dishName(data)}</p>
                                                                    {(data.size || (data.extras && data.extras.length > 0)) &&
                                                                        <small className='text-muted d-block'>
                                                                            {tv('size', data.size)}
                                                                            {data.extras && data.extras.length > 0 ? ` · ${data.extras.map((e) => tv('extra', e)).join(t('common.listSep'))}` : ''}
                                                                        </small>
                                                                    }
                                                                    {data.notes && <small className='text-muted d-block fst-italic'>"<bdi>{data.notes}</bdi>"</small>}
                                                                </div>
                                                            </td>
                                                            <td>{data.price}</td>
                                                            <td>
                                                                <div className="prdct-qty-container">
                                                                    <button className='prdct-qty-btn' type='button'
                                                                        onClick={data.qnty <= 1 ? () => handleDecrement(data.id) : () => handleSingleDecrement(data)}
                                                                    >
                                                                        <i className='fa fa-minus'></i>
                                                                    </button>
                                                                    <input type="text" className='qty-input-box' value={data.qnty} disabled name="" id="" />
                                                                    <button className='prdct-qty-btn' type='button' onClick={() => handleIncrement(data)}>
                                                                        <i className='fa fa-plus'></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='text-right'><Money value={data.qnty * data.price} /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                            }
                        </div>

                        {
                            cart.length > 0 &&
                            <div className="card-body pt-3">
                                <div className='promo-row d-flex gap-2 mb-3'>
                                    {
                                        promo
                                            ? <div className='promo-applied'>
                                                <span>{t('cart.promoPre')} <strong>{promo.code}</strong> {t('cart.promoPost')} <bdi dir='ltr'>(-{promo.percent}%)</bdi></span>
                                                <button className='promo-remove' onClick={handleRemovePromo}>{t('cart.promoRemove')}</button>
                                            </div>
                                            : <>
                                                <input
                                                    type="text"
                                                    className='promo-input'
                                                    placeholder={t('cart.promoPlaceholder')}
                                                    value={promoInput}
                                                    onChange={(e) => setPromoInput(e.target.value)}
                                                />
                                                <button className='btn btn-outline-secondary btn-sm' onClick={handleApplyPromo}>{t('cart.promoApply')}</button>
                                            </>
                                    }
                                </div>

                                <div className='order-summary'>
                                    <div className='summary-line'><span>{t('cart.items', { count: totalquantity })}</span><span>&nbsp;</span></div>
                                    <div className='summary-line'><span>{t('common.subtotal')}</span><span><Money value={totalprice} /></span></div>
                                    <div className='summary-line'><span>{t('common.deliveryFee')}</span><span>{deliveryFee === 0 ? t('common.free') : <Money value={deliveryFee} />}</span></div>
                                    {promo && <div className='summary-line text-success'><span>{t('cart.discountPct', { percent: promo.percent })}</span><span><Money value={discount} negative /></span></div>}
                                    <div className='summary-line total-line'><span>{t('common.total')}</span><span><Money value={grandTotal} /></span></div>
                                </div>

                                <Link to='/checkout' className='btn checkout-btn w-100 mt-3'>
                                    {t('cart.checkout')}
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartDetails

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './auth.css';
import { login, USERS_STORAGE_KEY } from '../../redux/feature/authSlice';
import { useLanguage } from '../../i18n/LanguageContext';

// built per language so validation messages are translated
const buildSchema = (t) => yup.object({
    name: yup.string().trim().min(2, t('val.name.min2')).required(t('val.name.required')),
    email: yup.string().trim().email(t('val.email.invalid')).required(t('val.email.required')),
    password: yup.string().min(6, t('val.password.min')).required(t('val.password.required')),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], t('val.password.match'))
        .required(t('val.confirm.required')),
}).required();

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, lang } = useLanguage();
    const schema = useMemo(() => buildSchema(t), [t]);

    const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    // switch any visible error message to the new language
    useEffect(() => {
        const failing = Object.keys(errors);
        if (failing.length) trigger(failing);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);

    const onSubmit = (data) => {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
        } catch (err) {
            users = [];
        }

        const email = data.email.trim().toLowerCase();

        if (users.some((u) => u.email === email)) {
            toast.error(t('toast.emailExists'));
            return;
        }

        const newUser = { name: data.name.trim(), email, password: data.password };
        users.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        dispatch(login({ name: newUser.name, email: newUser.email }));
        toast.success(t('toast.welcomeNew', { brand: t('brand.full'), name: newUser.name }));
        navigate('/');
    };

    return (
        <div className='container auth-page py-5'>
            <div className='auth-card mx-auto'>
                <h3 className='mb-1 text-center'>{t('auth.createTitle')}</h3>
                <p className='text-muted text-center mb-4'>{t('auth.join', { brand: t('brand.full') })}</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className='mb-3'>
                        <label className='form-label'>{t('common.fullName')}</label>
                        <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register('name')} />
                        {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>{t('common.email')}</label>
                        <input type='email' dir='ltr' className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email')} />
                        {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>{t('common.password')}</label>
                        <input type='password' className={`form-control ${errors.password ? 'is-invalid' : ''}`} {...register('password')} />
                        {errors.password && <div className='invalid-feedback'>{errors.password.message}</div>}
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>{t('auth.confirmPassword')}</label>
                        <input type='password' className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} {...register('confirmPassword')} />
                        {errors.confirmPassword && <div className='invalid-feedback'>{errors.confirmPassword.message}</div>}
                    </div>

                    <button type='submit' className='btn checkout-btn w-100' disabled={isSubmitting}>
                        {t('auth.createAccount')}
                    </button>
                </form>

                <p className='text-center text-muted mt-4 mb-0'>
                    {t('auth.haveAccount')} <Link to='/login'>{t('auth.login')}</Link>
                </p>
            </div>
        </div>
    )
}

export default Register

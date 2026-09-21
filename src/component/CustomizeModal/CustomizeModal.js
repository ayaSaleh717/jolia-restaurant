import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './customizeModal.css'
import { useLanguage } from '../../i18n/LanguageContext';
import Money from '../../i18n/Money';

// price add-ons for each size option
const SIZE_OPTIONS = [
    { key: 'Small', label: 'Small', extra: 0 },
    { key: 'Medium', label: 'Medium', extra: 2 },
    { key: 'Large', label: 'Large', extra: 4 },
];

// checkbox add-ons
const EXTRA_OPTIONS = [
    { key: 'Extra Cheese', label: 'Extra Cheese', extra: 1.5 },
    { key: 'Extra Sauce', label: 'Extra Sauce', extra: 1 },
    { key: 'Extra Spicy', label: 'Extra Spicy', extra: 0 },
];

function CustomizeModal({ show, item, onHide, onConfirm }) {
    const { t, tv, dishName } = useLanguage();
    const [size, setSize] = useState('Small');
    const [extras, setExtras] = useState([]);
    const [notes, setNotes] = useState('');

    // reset the form whenever a new dish is opened
    useEffect(() => {
        if (show) {
            setSize('Small');
            setExtras([]);
            setNotes('');
        }
    }, [show, item]);

    if (!item) return null;

    const toggleExtra = (key) => {
        setExtras((prev) =>
            prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
        );
    };

    const sizeExtra = SIZE_OPTIONS.find((s) => s.key === size)?.extra || 0;
    const extrasTotal = extras.reduce((sum, key) => {
        const found = EXTRA_OPTIONS.find((e) => e.key === key);
        return sum + (found ? found.extra : 0);
    }, 0);
    const unitPrice = item.price + sizeExtra + extrasTotal;

    const handleAdd = () => {
        const sortedExtras = [...extras].sort();
        const cartLineId = `${item.id}-${size}-${sortedExtras.join('|') || 'none'}`;

        onConfirm({
            id: cartLineId,
            dishId: item.id,
            dish: item.dish,
            imgdata: item.imgdata,
            category: item.category,
            price: Number(unitPrice.toFixed(2)),
            basePrice: item.price,
            size,
            extras: sortedExtras,
            notes: notes.trim(),
        });
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered className="customize-modal">
            <Modal.Header closeButton>
                <Modal.Title>{dishName(item)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={item.imgdata} alt={dishName(item)} className="customize-img" loading="lazy" />

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">{t('modal.size')}</Form.Label>
                    {SIZE_OPTIONS.map((opt) => (
                        <Form.Check
                            key={opt.key}
                            type="radio"
                            id={`size-${opt.key}`}
                            name="size"
                            label={<>{tv('size', opt.key)} {opt.extra > 0 && <bdi dir="ltr">(+${opt.extra.toFixed(2)})</bdi>}</>}
                            checked={size === opt.key}
                            onChange={() => setSize(opt.key)}
                        />
                    ))}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">{t('modal.addons')}</Form.Label>
                    {EXTRA_OPTIONS.map((opt) => (
                        <Form.Check
                            key={opt.key}
                            type="checkbox"
                            id={`extra-${opt.key}`}
                            label={<>{tv('extra', opt.key)} {opt.extra > 0 && <bdi dir="ltr">(+${opt.extra.toFixed(2)})</bdi>}</>}
                            checked={extras.includes(opt.key)}
                            onChange={() => toggleExtra(opt.key)}
                        />
                    ))}
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">{t('modal.instructions')}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder={t('modal.instructionsPlaceholder')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">{t('modal.total')} <Money value={unitPrice} /></span>
                <Button className="add-cart-btn" onClick={handleAdd}>
                    {t('modal.add')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CustomizeModal

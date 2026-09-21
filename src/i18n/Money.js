import React from 'react'

// Prices always render left-to-right ("$ 12.50") so the symbol, digits and
// minus sign can't get shuffled by the surrounding Arabic (RTL) text.
function Money({ value, negative = false, className }) {
    return (
        <bdi dir='ltr' className={className}>
            {negative ? '- ' : ''}$ {Number(value).toFixed(2)}
        </bdi>
    )
}

export default Money

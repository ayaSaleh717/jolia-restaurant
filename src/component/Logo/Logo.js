import React from 'react'

// The J is drawn with `currentColor` so the mark inherits whatever text
// colour it sits in — the flame always stays ember.
const J_PATH = "M27 11C34 12 45 12.5 57 12.5C69 12.5 80 12 87 11C88 15 88 22 87 26C82 25.4 77 25.2 72 25.3V58C72 77 59 90 42 90C26 90 13 79 10 64L25 60C27 71 33 77 42 77C51 77 57 70 57 58V25.3C47 25.2 36 25.4 27 26C26 22 26 15 27 11Z";
const FLAME_PATH = "M43 32C44 44 55.5 48.5 55.5 60C55.5 68.5 49.5 75 42 75C34.5 75 28.5 68.5 28.5 60C28.5 51.5 35 47.5 39 39C40 45.5 42.5 49.5 46.5 52.5C42.5 45 42 38 43 32Z";

export function JouliaMark({ size = 32, flame = 'var(--color-ember)', className = '' }) {
    return (
        <svg
            className={`joulia-mark ${className}`}
            width={size}
            height={size}
            viewBox="0 0 96 96"
            aria-hidden="true"
            focusable="false"
        >
            <path fill="currentColor" d={J_PATH} />
            <path fill={flame} d={FLAME_PATH} />
        </svg>
    )
}

export default JouliaMark

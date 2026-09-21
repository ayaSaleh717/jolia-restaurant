import React from 'react'
import './skeleton.css'

function SkeletonCard() {
    return (
        <div className="skeleton-card mb-4">
            <div className="skeleton shimmer skeleton-img" />
            <div className="skeleton-body">
                <div className="skeleton shimmer skeleton-line w-75" />
                <div className="skeleton shimmer skeleton-line w-50" />
                <div className="skeleton shimmer skeleton-line w-100" style={{ height: '32px', marginTop: '10px' }} />
            </div>
        </div>
    )
}

export default SkeletonCard

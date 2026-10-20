'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);

  return (
    <article className="product-card">
      {product.tag && (
        <span className="promo-tag">
          {product.tag}
          {product.plus && <span className="promo-plus">+1</span>}
        </span>
      )}
      <div className="product-img" aria-hidden="true">{product.emoji}</div>
      <div className="product-price-row">
        <span className="price">${product.price.toFixed(2)}</span>
        {product.was && <span className="was">${product.was.toFixed(2)}</span>}
        <button
          className={`heart ${liked ? 'liked' : ''}`}
          aria-label={`Add ${product.name} to wishlist`}
          onClick={() => setLiked((l) => !l)}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>
      <p className="product-name">{product.name}</p>
      <button className="btn btn-solid add-btn" onClick={add}>Add to cart</button>
    </article>
  );
}

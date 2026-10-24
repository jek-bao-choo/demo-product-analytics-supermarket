'use client';

import { useState } from 'react';
import { useCart } from '../CartContext';
import { formatRp } from '../../furniture-data';

export default function FmProductCard({ product }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);

  return (
    <article className="fm-card">
      <div className="fm-card-img" aria-hidden="true">{product.emoji}</div>
      <button
        className={`fm-heart ${liked ? 'liked' : ''}`}
        aria-label={`Add ${product.name} to wishlist`}
        onClick={() => setLiked((l) => !l)}
      >
        {liked ? '♥' : '♡'}
      </button>
      {product.tag && (
        <span className={`fm-tag ${product.tag === 'Lower price' ? '' : 'fm-tag-plain'}`}>{product.tag}</span>
      )}
      <p className="fm-card-name">{product.name}</p>
      <p className="fm-card-desc">{product.desc}</p>
      <p className={`fm-price ${product.was ? 'fm-price-sale' : ''}`}>{formatRp(product.price)}</p>
      {product.was && <p className="fm-was">Previous price {formatRp(product.was)}</p>}
      {product.rating && (
        <p className="fm-rating">★ {product.rating} ({product.reviews})</p>
      )}
      {/*
        PRODUCT ANALYTICS BEST PRACTICE: this button has no text, so it is named
        explicitly with data-dd-action-name (the same name as the supermarket's button,
        so one experiment metric covers both stores). For details, also send e.g.
          datadogRum.addAction('cart_add', { product_id: product.id, price: product.price })
      */}
      <button
        className="fm-add-btn"
        aria-label={`Add ${product.name} to shopping bag`}
        onClick={add}
        data-dd-action-name="Add to cart"
      >
        🛒+
      </button>
    </article>
  );
}

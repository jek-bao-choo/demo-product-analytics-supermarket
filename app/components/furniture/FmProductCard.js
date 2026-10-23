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
        PRODUCT ANALYTICS BEST PRACTICE: this button has no text, so name it explicitly
        (data-dd-action-name="Add to cart") or send a custom action with details, e.g.
          datadogRum.addAction('cart_add', { product_id: product.id, price: product.price })
        Without a name, the click is labelled from the aria-label.
      */}
      <button className="fm-add-btn" aria-label={`Add ${product.name} to shopping bag`} onClick={add}>
        🛒+
      </button>
    </article>
  );
}

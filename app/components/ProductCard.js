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
      {/*
        PRODUCT ANALYTICS BEST PRACTICE: name key actions after what the user intends.
          - data-dd-action-name="Add to cart" gives the click a stable name that does
            not change with the button text, and still shows when
            enablePrivacyForActionName masks other names. Experiments use it as a metric.
          - To filter funnels by product, also send a custom action with details, e.g.
              datadogRum.addAction('cart_add', { product_id: product.id, price: product.price })
          - No-code alternative: name the click in Datadog with the Action Management
            Visual Labeler. The name also applies to past data.
      */}
      <button className="btn btn-solid add-btn" onClick={add} data-dd-action-name="Add to cart">
        Add to cart
      </button>
    </article>
  );
}

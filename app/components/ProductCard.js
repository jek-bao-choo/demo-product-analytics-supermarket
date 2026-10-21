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
          - Today the click name comes from the button text ("Add to cart"). That works,
            but every product's button gets the same name. To set a stable name
            explicitly, add data-dd-action-name="Add to cart" to the button. Explicit
            names are still shown even when enablePrivacyForActionName masks the rest.
          - To filter funnels by product, also send a custom action with details, e.g.
              datadogRum.addAction('cart_add', { product_id: product.id, price: product.price })
          - No-code alternative: name the click in Datadog with the Action Management
            Visual Labeler. The name also applies to past data.
      */}
      <button className="btn btn-solid add-btn" onClick={add}>Add to cart</button>
    </article>
  );
}

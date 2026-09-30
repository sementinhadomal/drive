import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Camera, Check, ChevronDown, CircleAlert, Minus, Monitor, Plus, Radio, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Star, Trash2, Truck, Wifi, Zap } from 'lucide-react';
import { FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb, FaCcVisa } from 'react-icons/fa';
import { SiApplepay, SiGooglepay } from 'react-icons/si';
import brandLogo from '@assets/diydeg-drive-logo-standard.png';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const productImages = [
  'https://m.media-amazon.com/images/I/61rwi5QuvhL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71J4Xl8PyFL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71tBeinedzL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71NwxYRk7SL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71XQSyvDQeL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/61kC7Px6f5L._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71nrQDByzeL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71qBE4rbOQL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71M0EkkxTTL._AC_SL1500_.jpg',
];

const sampleFeedback = [
  {
    topic: 'Wireless CarPlay + Android Auto',
    quote: 'I like having maps, calls, and music on a larger screen without replacing the factory stereo.',
  },
  {
    topic: '10.26-inch display',
    quote: 'The larger display gives navigation and everyday controls their own clear space on the dashboard.',
  },
  {
    topic: 'Front + rear cameras',
    quote: 'Having front and rear camera support makes the setup useful for more than navigation alone.',
  },
  {
    topic: 'Simple add-on',
    quote: 'I wanted an upgrade that adds a connected screen, not a full stereo replacement.',
  },
  {
    topic: 'Flexible audio',
    quote: 'AUX and FM transmission offer more than one way to get audio from the display into the car.',
  },
  {
    topic: 'Everything in one kit',
    quote: 'The display, charger, extension cable, rear camera, AUX cable, screws, and manual keep the essentials together.',
  },
];

const CART_STORAGE_KEY = 'diydeg-drive-cart-quantity';
const CHECKOUT_INTENT_STORAGE_KEY = 'diydeg-drive-checkout-intent';
const PRODUCT_TITLE = '10.26-inch Wireless CarPlay Display';
const PRODUCT_SUMMARY = 'Wireless CarPlay and Android Auto, with front and rear camera support.';
const PRODUCT_PRICE = 39.90;
const PRODUCT_DELIVERY = 'Free delivery shown on the supplied listing';
const PRODUCT_IMAGE = productImages[0];

// Shopify integration
const SHOPIFY_VARIANT_ID = '53059045392696';
const SHOPIFY_DOMAIN = 'w0kf80-n8.myshopify.com';

function redirectToShopifyCheckout(quantity: number) {
  const qty = Math.min(99, Math.max(1, Math.round(quantity) || 1));
  window.location.href = `https://${SHOPIFY_DOMAIN}/cart/${SHOPIFY_VARIANT_ID}:${qty}`;
}

function clampQuantity(value: number) {
  return Math.min(99, Math.max(1, Math.round(value) || 1));
}

function readStoredQuantity(key: string) {
  if (typeof window === 'undefined') return 0;
  const parsed = Number(window.localStorage.getItem(key));
  return Number.isFinite(parsed) && parsed > 0 ? clampQuantity(parsed) : 0;
}

function useStoredCartQuantity() {
  const [quantity, setQuantity] = useState(() => readStoredQuantity(CART_STORAGE_KEY));

  useEffect(() => {
    const sync = () => setQuantity(readStoredQuantity(CART_STORAGE_KEY));
    window.addEventListener('storage', sync);
    window.addEventListener('diydeg-cart-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('diydeg-cart-change', sync);
    };
  }, []);

  const updateQuantity = (nextQuantity: number) => {
    const next = nextQuantity <= 0 ? 0 : clampQuantity(nextQuantity);
    if (next === 0) window.localStorage.removeItem(CART_STORAGE_KEY);
    else window.localStorage.setItem(CART_STORAGE_KEY, String(next));
    setQuantity(next);
    window.dispatchEvent(new Event('diydeg-cart-change'));
  };

  return [quantity, updateQuantity] as const;
}

function saveCheckoutIntent(quantity: number) {
  window.localStorage.setItem(CHECKOUT_INTENT_STORAGE_KEY, String(clampQuantity(quantity)));
}

function readCheckoutIntent() {
  return readStoredQuantity(CHECKOUT_INTENT_STORAGE_KEY);
}

function StoreHeader() {
  const [cartQuantity] = useStoredCartQuantity();
  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/" data-testid="link-brand">
          <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
        </Link>
        <Link className="nav-cart" href="/cart" aria-label={`Open basket (${cartQuantity})`} data-testid="link-cart">
          <span className="nav-cart-icon" aria-hidden="true">
            <ShoppingCart size={18} />
            {cartQuantity > 0 && <span className="nav-cart-count" data-testid="text-cart-count">{cartQuantity}</span>}
          </span>
          <span className="nav-cart-label">Basket</span>
        </Link>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <footer className="footer cart-footer">
      <div className="container footer-row">
        <img className="footer-brand-logo" src={brandLogo} alt="Diydeg Drive" />
        <span>Product photos from the supplied listing gallery</span>
        <span>Product details shown in English for clarity.</span>
      </div>
    </footer>
  );
}

function OrderSummary({ quantity }: { quantity: number }) {
  const subtotal = PRODUCT_PRICE * quantity;
  return (
    <>
      <div className="summary-lines">
        <div className="summary-line">
          <span>Subtotal</span>
          <strong data-testid="text-subtotal">${subtotal.toFixed(2)}</strong>
        </div>
        <div className="summary-line delivery">
          <span>Delivery</span>
          <strong data-testid="text-delivery">Free</strong>
        </div>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong data-testid="text-total">${subtotal.toFixed(2)}</strong>
      </div>
    </>
  );
}

function Cart() {
  const [quantity, setQuantity] = useStoredCartQuantity();
  const [, setLocation] = useLocation();
  const hasProduct = quantity > 0;

  const goToCheckout = () => {
    if (!hasProduct) return;
    redirectToShopifyCheckout(quantity);
  };

  return (
    <div className="cart-shell">
      <StoreHeader />
      <main className="cart-main">
        <div className="container">
          <div className="cart-layout">
            <section className="cart-items-panel" aria-labelledby="cart-items-title">
              {hasProduct ? (
                <>
                  <div className="cart-panel-label">
                    <span id="cart-items-title">Product</span>
                    <span data-testid="text-cart-item-count">{quantity} {quantity === 1 ? 'unit' : 'units'}</span>
                  </div>
                  <article className="cart-product-row" data-testid="row-cart-product">
                    <div className="cart-product-image">
                      <img src={PRODUCT_IMAGE} alt={PRODUCT_TITLE} />
                    </div>
                    <div className="cart-product-meta">
                      <h2>{PRODUCT_TITLE}</h2>
                      <p>{PRODUCT_SUMMARY}</p>
                      <div className="cart-product-actions">
                        <div className="cart-quantity" aria-label="Basket quantity">
                          <button type="button" aria-label="Decrease basket quantity" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)} data-testid="button-cart-decrease"><Minus size={13} /></button>
                          <output aria-label="Basket quantity" data-testid="value-cart-quantity">{quantity}</output>
                          <button type="button" aria-label="Increase basket quantity" disabled={quantity >= 99} onClick={() => setQuantity(quantity + 1)} data-testid="button-cart-increase"><Plus size={13} /></button>
                        </div>
                        <button className="cart-remove" type="button" onClick={() => setQuantity(0)} data-testid="button-cart-remove">
                          <Trash2 size={12} aria-hidden="true" /> Remove
                        </button>
                      </div>
                    </div>
                    <strong className="cart-product-price" data-testid="text-cart-line-total">${(PRODUCT_PRICE * quantity).toFixed(2)}</strong>
                  </article>
                </>
              ) : (
                <div className="cart-empty" data-testid="status-cart-empty">
                  <div className="cart-empty-icon"><ShoppingBag size={20} aria-hidden="true" /></div>
                  <h2>Your basket is empty.</h2>
                  <p>Choose the Diydeg display from the product page when you are ready to add it here.</p>
                  <Link className="cart-back-link" href="/" data-testid="link-empty-cart-product"><ArrowLeft size={14} /> Back to product</Link>
                </div>
              )}
            </section>
            <aside className="cart-summary" aria-labelledby="cart-summary-title">
              <h2 id="cart-summary-title">Order summary</h2>
              {hasProduct ? (
                <>
                  <OrderSummary quantity={quantity} />
                  <button className="cart-checkout-button" type="button" onClick={goToCheckout} data-testid="button-cart-checkout">CHECKOUT</button>
                  <div className="cart-trust">
                    <span><Truck size={12} aria-hidden="true" /> {PRODUCT_DELIVERY}</span>
                    <span><ShieldCheck size={12} aria-hidden="true" /> Secure checkout via Shopify</span>
                  </div>
                </>
              ) : (
                <div className="checkout-empty" data-testid="status-cart-summary-empty">
                  <strong>No product selected.</strong><br />Your order summary will appear here after you add the display.
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}

function Checkout() {
  const [cartQuantity] = useStoredCartQuantity();
  const [quantity] = useState(() => readCheckoutIntent() || cartQuantity);
  return (
    <div className="cart-shell">
      <StoreHeader />
      <main className="checkout-main">
        <div className="container checkout-layout">
          <section className="checkout-intro" aria-labelledby="checkout-title">
            <div className="eyebrow">Checkout status / 02</div>
            <h1 id="checkout-title">One last check before the road.</h1>
            <p>We have your product selection ready to review. The purchase destination itself has not been connected to Diydeg Drive yet.</p>
            <div className="checkout-notice" role="status" data-testid="status-checkout-not-connected">
              <CircleAlert size={17} aria-hidden="true" />
              <div>
                <strong>Checkout is not connected.</strong>
                No payment details are collected here, no provider is integrated, and no charge can be made. Connect a real checkout destination before taking orders.
              </div>
            </div>
            <div className="checkout-actions">
              <Link className="button-secondary" href="/cart" data-testid="link-checkout-basket"><ArrowLeft size={15} /> Back to basket</Link>
              <Link className="checkout-link" href="/" data-testid="link-checkout-product">Return to product <ArrowUpRight size={14} /></Link>
            </div>
          </section>
          <aside className="checkout-card" aria-labelledby="checkout-order-title">
            <h2 id="checkout-order-title">Your order</h2>
            {quantity > 0 ? (
              <>
                <div className="checkout-preview" data-testid="row-checkout-product">
                  <div className="checkout-preview-image"><img src={PRODUCT_IMAGE} alt={PRODUCT_TITLE} /></div>
                  <div>
                    <h3>{PRODUCT_TITLE}</h3>
                    <p data-testid="text-checkout-quantity">Quantity {quantity}</p>
                  </div>
                  <strong className="checkout-preview-price">${(PRODUCT_PRICE * quantity).toFixed(2)}</strong>
                </div>
                <OrderSummary quantity={quantity} />
                <p className="checkout-note">Delivery: {PRODUCT_DELIVERY}. This is a review-only screen until a checkout destination is connected.</p>
              </>
            ) : (
              <div className="checkout-empty" data-testid="status-checkout-empty">
                <strong>There is no active order.</strong><br />Return to the product page or basket to choose the display.
              </div>
            )}
          </aside>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}

function PaymentBrandMarks() {
  return (
    <div className="purchase-payment">
      <span className="purchase-payment-label">Payment options shown on this page</span>
      <div className="gallery-card-brands" role="img" aria-label="Visa, Mastercard, American Express, Discover, Diners Club, JCB, UnionPay, Apple Pay, and Google Pay">
        <FaCcVisa className="card-brand-icon visa" aria-hidden="true" />
        <svg className="card-brand-icon mastercard" viewBox="0 0 48 32" aria-hidden="true">
          <circle cx="17" cy="16" r="14" fill="#eb001b" />
          <circle cx="31" cy="16" r="14" fill="#f79e1b" />
          <path d="M24 3.876a14 14 0 0 1 0 24.248 14 14 0 0 1 0-24.248Z" fill="#ff5f00" />
        </svg>
        <FaCcAmex className="card-brand-icon amex" aria-hidden="true" />
        <FaCcDiscover className="card-brand-icon discover" aria-hidden="true" />
        <FaCcDinersClub className="card-brand-icon diners" aria-hidden="true" />
        <FaCcJcb className="card-brand-icon jcb" aria-hidden="true" />
        <span className="card-brand-unionpay" aria-hidden="true">UnionPay</span>
        <SiApplepay className="card-brand-icon applepay" aria-hidden="true" />
        <SiGooglepay className="card-brand-icon googlepay" aria-hidden="true" />
      </div>
    </div>
  );
}

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeImage, setActiveImage] = useState(0);
  const galleryTouchStartX = useRef<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useStoredCartQuantity();
  const [, setLocation] = useLocation();
  const addToBasket = () => {
    setCartQuantity(cartQuantity + quantity);
    setLocation('/cart');
  };
  const buyNow = () => {
    redirectToShopifyCheckout(quantity);
  };
  const faqs = [
    ['Will it replace my factory stereo?', 'No. Diydeg is a standalone cockpit display designed to add a larger screen without replacing the vehicle’s factory stereo.'],
    ['How does audio reach the vehicle?', 'Use the included AUX cable, or use FM transmission when your vehicle has an FM radio. FM transmission depends on the vehicle having an FM radio.'],
    ['Does the kit include a memory card?', 'No. A memory card is not included, so add one separately if you want to use the recording function.'],
    ['What comes in the box?', 'Display, car charger, extension cable, rear camera, AUX cable, screws, and manual.'],
    ['What is the warranty period?', 'The listing states a 120-day manufacturer warranty.'],
  ];
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container nav">
          <a className="brand" href="#top" data-testid="link-brand"><img className="brand-logo" src={brandLogo} alt="Diydeg Drive" /></a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#features" data-testid="link-features">Features</a>
            <a href="#recording" data-testid="link-recording">Recording</a>
            <a href="#specs" data-testid="link-specifications">Specifications</a>
            <a href="#faq" data-testid="link-faq">FAQ</a>
          </nav>
          <Link className="nav-cart" href="/cart" aria-label={`Open basket (${cartQuantity})`} data-testid="link-cart">
            <span className="nav-cart-icon" aria-hidden="true">
              <ShoppingCart size={18} />
              {cartQuantity > 0 && <span className="nav-cart-count" data-testid="text-cart-count">{cartQuantity}</span>}
            </span>
            <span className="nav-cart-label">Basket</span>
          </Link>
        </div>
      </header>

      <main id="top">
        <section className="hero product-detail-hero">
          <div className="container product-detail-grid">
            <div className="product-gallery product-detail-gallery reveal" aria-label="Product photo gallery">
              <figure
                className="gallery-main"
                onTouchStart={(event) => { galleryTouchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
                onTouchEnd={(event) => {
                  const startX = galleryTouchStartX.current;
                  const endX = event.changedTouches[0]?.clientX;
                  galleryTouchStartX.current = null;
                  if (startX === null || endX === undefined || Math.abs(endX - startX) < 40) return;
                  setActiveImage((current) => (current + (endX < startX ? 1 : -1) + productImages.length) % productImages.length);
                }}
                onTouchCancel={() => { galleryTouchStartX.current = null; }}
              >
                <img
                  src={productImages[activeImage]}
                  alt={`Diydeg portable CarPlay display — product photo ${activeImage + 1}`}
                  fetchPriority="high"
                />
                <figcaption className="gallery-count">
                  PRODUCT PHOTOS / {String(activeImage + 1).padStart(2, '0')} OF {String(productImages.length).padStart(2, '0')}
                </figcaption>
              </figure>
              <div className="gallery-thumbnails" aria-label="Choose a product photo">
                {productImages.map((image, index) => (
                  <button
                    className={activeImage === index ? 'gallery-thumb active' : 'gallery-thumb'}
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show product photo ${index + 1}`}
                    aria-pressed={activeImage === index}
                  >
                    <img src={image} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <div className="gallery-pagination" role="group" aria-label="Choose a product photo">
                {productImages.map((image, index) => (
                  <button
                    className={activeImage === index ? 'gallery-pagination-button active' : 'gallery-pagination-button'}
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show product photo ${index + 1}`}
                    aria-pressed={activeImage === index}
                    data-testid={`button-gallery-dot-${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <aside className="product-purchase-card reveal delay-2" id="product-purchase" aria-labelledby="product-purchase-title">
              <h1 className="product-purchase-title" id="product-purchase-title">10.26-inch Wireless CarPlay Display</h1>
              <p className="product-purchase-summary">Wireless CarPlay and Android Auto, with front and rear camera support.</p>
              <div className="product-proof-line"><strong>10.26-inch</strong><span aria-hidden="true">•</span><span>Wireless CarPlay + Android Auto</span></div>
              <div className="product-price-row">
                <div className="product-current-price"><span>$</span><strong>39</strong><sup>.90</sup></div>
                <del className="product-old-price">$115.45</del>
              </div>
              <p className="product-savings">Save $75.55 (65%)</p>
              <ul className="product-highlights">
                {[
                  '10.26-inch touchscreen display',
                  'Wireless Apple CarPlay + Android Auto',
                  'Front and rear camera support',
                  'AUX + FM audio; no stereo replacement',
                ].map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
              </ul>
              <div className="product-quantity-row">
                <span>Quantity</span>
                <div className="product-quantity-control">
                   <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} data-testid="button-product-decrease"><Minus size={14} /></button>
                   <output aria-label="Quantity" aria-live="polite" data-testid="value-product-quantity">{quantity}</output>
                   <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(99, current + 1))} data-testid="button-product-increase"><Plus size={14} /></button>
                </div>
              </div>
              <div className="product-buy-actions">
                 <button className="product-add-button" type="button" onClick={addToBasket} aria-describedby="product-checkout-note" data-testid="button-add-to-basket">Add to basket</button>
                 <button className="product-buy-button" type="button" onClick={buyNow} aria-describedby="product-checkout-note" data-testid="button-gallery-buy">Buy now</button>
              </div>
              <div className="product-assurance">
                <span><ShieldCheck size={15} />120-day manufacturer warranty listed</span>
                <span><Truck size={15} />Free delivery shown on the supplied listing</span>
              </div>
              <PaymentBrandMarks />
                <p className="product-checkout-note" id="product-checkout-note">Add to basket saves your selection and opens the basket. Buy now goes directly to secure Shopify checkout.</p>
            </aside>
          </div>
        </section>

        <div className="signal-strip">
          <div className="container signal-grid">
            <div className="signal-item"><Monitor size={20} /><div><span>10.26-inch display</span><small>Wide touchscreen view</small></div></div>
            <div className="signal-item"><Wifi size={20} /><div><span>Wireless CarPlay</span><small>Apple + Android Auto</small></div></div>
            <div className="signal-item"><Camera size={20} /><div><span>Front + rear record</span><small>1080p / 140° view</small></div></div>
            <div className="signal-item"><Radio size={20} /><div><span>Flexible audio</span><small>AUX + FM transmission</small></div></div>
          </div>
        </div>

        <section className="section" id="features">
          <div className="container">
            <div className="intro-grid">
              <div><div className="eyebrow">Why it exists / 02</div><h2 className="section-title">A better<br />centerline.</h2></div>
              <p>Not a new stereo. Not a complicated rebuild. Diydeg puts the useful parts of a modern connected drive in a dedicated screen that sits in front of the setup you already know.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card large"><span className="card-index">01 / CONNECT</span><div><div className="feature-icon"><Smartphone size={20} /></div><h3>Bring your phone’s best features forward.</h3><p>Wireless Apple CarPlay and Android Auto put maps, calls, messages, music, and familiar controls on a larger, more visible screen.</p></div><div className="mono" style={{fontSize:'10px', color:'#c2d3e8'}}>WIRELESS INTERFACE / EVERYDAY CONTROL</div></article>
              <article className="feature-card"><span className="card-index">02</span><div className="feature-icon"><Zap size={20} /></div><h3>Made to add, not replace.</h3><p>Keep your factory stereo in place and add a dedicated display to the cockpit.</p></article>
              <article className="feature-card"><span className="card-index">03</span><div className="feature-icon"><Radio size={20} /></div><h3>Choose your audio path.</h3><p>Use AUX, or FM transmission when the vehicle has an FM radio.</p></article>
            </div>
          </div>
        </section>

        <section className="section feedback-section" id="feedback">
          <div className="container">
            <div className="feedback-heading">
              <div>
                <div className="eyebrow">Sample feedback / 03</div>
                <h2 className="section-title">Small upgrade.<br />Better daily drive.</h2>
              </div>
            </div>
            <div className="feedback-grid">
              {sampleFeedback.map((feedback, index) => (
                <article className="feedback-card" key={feedback.topic}>
                  <div className="feedback-stars" role="img" aria-label="Illustrative five-star rating">
                    {Array.from({ length: 5 }, (_, star) => <Star key={star} size={16} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />)}
                  </div>
                  <blockquote>“{feedback.quote}”</blockquote>
                  <div className="feedback-card-footer">
                    <span className="feedback-card-topic">{feedback.topic}</span>
                    <span className="feedback-card-label">Example {String(index + 1).padStart(2, '0')}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="recording">
          <div className="container camera-layout">
            <div className="camera-copy"><div className="eyebrow">Road record / 04</div><h2 className="section-title">Two angles.<br />One clear habit.</h2><p>Front and rear cameras give your drive a wider visual record. Both are listed at 1080p with a 140-degree viewing angle, with loop recording for continued capture.</p><div className="camera-list"><div><Check size={16} /><span>Front recording <small>1080p / 140° viewing angle</small></span></div><div><Check size={16} /><span>Rear recording <small>1080p / 140° viewing angle</small></span></div><div><Check size={16} /><span>Loop recording <small>Memory card sold separately</small></span></div></div></div>
            <div className="recording-frame" aria-label="Illustration of driving recording view"><div className="rec-road" /><div className="recording-ui"><div className="rec-top"><span className="rec-dot">REC / FRONT</span><span>1080P&nbsp;&nbsp;140°</span></div><span className="rec-label">DRIVE LOG / 09:41:18</span><div className="rec-bottom"><span>LOOP RECORDING</span><span>CAM 01</span></div></div></div>
          </div>
        </section>

        <section className="section" id="specs">
          <div className="container spec-layout">
            <div><div className="eyebrow">The essentials / 05</div><h2 className="section-title">Specifics<br />that matter.</h2><p className="spec-copy">A straightforward kit with the features drivers actually see and use. Details below reflect the product listing.</p></div>
            <div className="spec-table">
              <div className="spec-row"><span>Display</span><span>10.26-inch touchscreen</span></div>
              <div className="spec-row"><span>Phone connection</span><span>Wireless Apple CarPlay + Android Auto</span></div>
              <div className="spec-row"><span>Front camera</span><span>1080p / 140° viewing angle</span></div>
              <div className="spec-row"><span>Rear camera</span><span>1080p / 140° viewing angle</span></div>
              <div className="spec-row"><span>Recording</span><span>Loop recording</span></div>
              <div className="spec-row"><span>Audio</span><span>AUX cable + FM transmission*</span></div>
              <div className="spec-row"><span>Warranty</span><span>120-day manufacturer warranty</span></div>
              <div className="spec-row"><span>Important</span><span>Memory card is not included</span></div>
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container kit-grid">
            <div><div className="eyebrow">In the box / 06</div><h2 className="section-title">Everything<br />to get set.</h2><p className="kit-copy">The listing includes the core display, camera hardware, power, connection pieces, and documentation.</p></div>
            <div className="kit-list">
              {['Display', 'Car charger', 'Extension cable', 'Rear camera', 'AUX cable', 'Screws', 'Manual'].map((item, index) => <div className="kit-item" key={item} data-testid={`kit-item-${index}`}><Check size={16} />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="offer" id="offer">
          <div className="container">
            <div className="offer-card">
              <div className="offer-product-visual">
                <img
                  src={productImages[0]}
                  alt="Diydeg 10.26-inch portable CarPlay display"
                  loading="lazy"
                />
                <span>DIYDEG / 10.26-INCH DISPLAY</span>
              </div>
               <div className="offer-copy"><div className="eyebrow">The practical upgrade / 07</div><h2>More screen.<br />Less compromise.</h2><p>Explore the product details, camera setup, and included accessories. Buy now opens a review screen while the real checkout destination is being connected.</p></div>
               <div className="price-box"><span className="price-label">Special offer</span><div className="prices"><span className="price-current">$39.90</span><span className="price-regular">$115.45</span></div><button className="button-primary checkout-placeholder" type="button" onClick={buyNow} aria-describedby="checkout-status" data-testid="button-checkout-pending">Buy now</button><PaymentBrandMarks /><div className="price-disclaimer" id="checkout-status">Buy now takes you directly to secure checkout. Payment is processed by Shopify.</div></div>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="container faq-layout">
            <div><div className="eyebrow">Good to know / 08</div><h2 className="section-title">Before you<br />hit the road.</h2></div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button className="faq-button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} data-testid={`button-faq-${index}`}><span>{question}</span><ChevronDown size={18} /></button>{openFaq === index && <div className="faq-answer" data-testid={`text-faq-answer-${index}`}>{answer}</div>}</div>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container footer-row"><img className="footer-brand-logo" src={brandLogo} alt="Diydeg Drive" /><span>Product photos from the supplied listing gallery</span><span>Product details shown in English for clarity.</span></div></footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/" component={Home} />
        <Route path="/carplay1" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
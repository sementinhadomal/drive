import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, BatteryCharging, Check, ChevronDown, Info, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag, ShoppingCart, Star, Trash2, Truck, Wind, Wrench } from 'lucide-react';
import { FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb, FaCcVisa } from 'react-icons/fa';
import { SiApplepay, SiGooglepay } from 'react-icons/si';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import brandLogo from '@assets/diydeg-drive-logo-standard.png';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const PRODUCT_ID = 'diydeg-electric-hydraulic-jack-kit';
const PRODUCT_TITLE = 'Electric Hydraulic Car Jack Kit — 5 Ton 12V';
const PRODUCT_PRICE = 29.90;
const PRODUCT_PRICE_LABEL = '$29.90';
const DELIVERY_COPY = 'Free delivery shown on the supplied listing';
const CART_STORAGE_KEY = `diydeg-drive-cart-${PRODUCT_ID}`;
const CHECKOUT_INTENT_KEY = `diydeg-drive-checkout-intent-${PRODUCT_ID}`;

// Shopify integration
const SHOPIFY_VARIANT_ID = '53059045491000';
const SHOPIFY_DOMAIN = 'w0kf80-n8.myshopify.com';

function redirectToShopifyCheckout(quantity: number) {
  const qty = Math.min(99, Math.max(1, Math.round(quantity) || 1));
  window.location.href = `https://${SHOPIFY_DOMAIN}/cart/${SHOPIFY_VARIANT_ID}:${qty}`;
}

const productImages = [
  'https://norvella.biz/__l5e/assets-v1/797b881a-c63f-4c16-aea0-738c62249429/jack-main.png',
  'https://norvella.biz/__l5e/assets-v1/5aea9a6d-880c-4933-84f5-b92aa9eb84cb/lifting.png',
  'https://norvella.biz/__l5e/assets-v1/c94984de-f0ba-4d7f-91db-7f8486ecc1d9/inflator.png',
  'https://norvella.biz/__l5e/assets-v1/4f9edd7a-beb2-43b9-8815-5734deface69/kit-case.png',
  'https://norvella.biz/__l5e/assets-v1/5c995318-b9a2-4c67-8554-b7ee460f9e46/jack-top.png',
  'https://norvella.biz/__l5e/assets-v1/878095ba-f334-44c8-8698-2b5930a87d9c/usage.png',
  'https://norvella.biz/__l5e/assets-v1/fb265796-ba37-4812-82c9-b2333b731b16/kit-contents.png',
];

function clampQuantity(value: number) {
  return Math.min(99, Math.max(1, Math.round(value)));
}

function readStoredQuantity() {
  if (typeof window === 'undefined') return 0;
  const value = Number(window.localStorage.getItem(CART_STORAGE_KEY));
  return Number.isFinite(value) && value > 0 ? clampQuantity(value) : 0;
}

function writeStoredQuantity(quantity: number) {
  if (typeof window === 'undefined') return;
  if (quantity <= 0) window.localStorage.removeItem(CART_STORAGE_KEY);
  else window.localStorage.setItem(CART_STORAGE_KEY, String(clampQuantity(quantity)));
  window.dispatchEvent(new CustomEvent('diydeg-cart-updated'));
}

type CheckoutIntent = { quantity: number; source: 'basket' | 'buy-now' };

function writeCheckoutIntent(quantity: number, source: CheckoutIntent['source']) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify({
    quantity: clampQuantity(quantity),
    source,
  }));
}

function readCheckoutIntent(): CheckoutIntent | null {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CHECKOUT_INTENT_KEY) || 'null') as Partial<CheckoutIntent> | null;
    if (!parsed || (parsed.source !== 'basket' && parsed.source !== 'buy-now') || typeof parsed.quantity !== 'number') return null;
    return { quantity: clampQuantity(parsed.quantity), source: parsed.source };
  } catch {
    return null;
  }
}

function useCartQuantity() {
  const [quantity, setQuantity] = useState(readStoredQuantity);
  useEffect(() => {
    const sync = () => setQuantity(readStoredQuantity());
    window.addEventListener('storage', sync);
    window.addEventListener('diydeg-cart-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('diydeg-cart-updated', sync);
    };
  }, []);
  return quantity;
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

const customerReviews = [
  {
    author: 'Mark T.',
    headline: 'Life saver on the motorway',
    date: '12 February 2026',
    rating: 5,
    quote: 'Had a blowout on the M1 and this kit made changing the tyre so much faster and safer than using a manual jack. The impact wrench is powerful enough for stuck bolts. Every car should have one.',
  },
  {
    author: 'Sarah Jenkins',
    headline: 'Perfect for anyone who struggles with manual jacks',
    date: '5 January 2026',
    rating: 5,
    quote: "I've always struggled with the strength needed for a traditional car jack. This electric one does all the work for you. Simple to plug into the cigarette lighter and lifts the car in about a minute.",
  },
  {
    author: 'David H.',
    headline: 'Substantial quality and great case',
    date: '28 December 2025',
    rating: 5,
    quote: 'The case is very rugged and the layout inside keeps everything organised. The built-in compressor is a great bonus for top-ups. Well worth the money for peace of mind.',
  },
  {
    author: 'James Wilson',
    headline: 'Impressive lifting power',
    date: '15 November 2025',
    rating: 5,
    quote: 'Used it on my SUV and it handled the weight without any issues. The height range is good. The light on the jack is actually useful when working at night.',
  },
  {
    author: 'Robert M.',
    headline: 'Great all-in-one solution',
    date: '3 November 2025',
    rating: 5,
    quote: 'No more carrying three different tools. This does it all. The impact wrench saves so much effort. Highly recommend.',
  },
  {
    author: 'Emma P.',
    headline: 'Good product, bit heavy',
    date: '20 October 2025',
    rating: 4,
    quote: 'The kit is excellent and works perfectly. Only giving 4 stars because the case is quite heavy to lift in and out of the boot, but that’s expected given the quality of the tools.',
  },
];

function PaymentBrandMarks() {
  return (
    <div className="payment-methods">
      <span className="payment-methods-label">Payment methods shown on the source listing</span>
      <div className="payment-brand-marks" role="img" aria-label="Visa, Mastercard, American Express, Discover, Diners Club, JCB, UnionPay, Apple Pay, and Google Pay">
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

function SiteHeader() {
  const cartQuantity = useCartQuantity();
  return (
    <header className="topbar">
      <div className="container nav">
        <a className="brand" href="#top" data-testid="link-brand">
          <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features" data-testid="link-features">Features</a>
          <a href="#kit" data-testid="link-kit">What&apos;s included</a>
          <a href="#specs" data-testid="link-specifications">Specifications</a>
          <a href="#faq" data-testid="link-faq">FAQ</a>
        </nav>
        <Link className="nav-cart" href="/cart" aria-label={`Open basket (${cartQuantity})`} data-testid="link-cart">
          <span className="nav-cart-icon" aria-hidden="true">
            <ShoppingCart size={18} />
            {cartQuantity > 0 && <span className="nav-cart-count" data-testid="status-cart-count">{cartQuantity}</span>}
          </span>
          <span className="nav-cart-label">Basket</span>
        </Link>
      </div>
    </header>
  );
}

function CommerceHeader() {
  const cartQuantity = useCartQuantity();
  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/" data-testid="link-commerce-brand">
          <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
        </Link>
        <Link className="nav-cart" href="/cart" aria-label={`Open basket (${cartQuantity})`} data-testid="link-commerce-cart">
          <span className="nav-cart-icon" aria-hidden="true">
            <ShoppingCart size={18} />
            {cartQuantity > 0 && <span className="nav-cart-count" data-testid="status-commerce-cart-count">{cartQuantity}</span>}
          </span>
          <span className="nav-cart-label">Basket</span>
        </Link>
      </div>
    </header>
  );
}

function CommerceFooter() {
  return (
    <footer className="commerce-footer">
      <div className="container commerce-footer-row">
        <img src={brandLogo} alt="Diydeg Drive" />
        <span>Product details shown in English for clarity.</span>
        <span>Delivery information reflects the supplied listing.</span>
      </div>
    </footer>
  );
}

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeImage, setActiveImage] = useState(0);
  const galleryTouchStartX = useRef<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cartQuantity = useCartQuantity();
  const [, setLocation] = useLocation();
  const addToBasket = () => {
    writeStoredQuantity(cartQuantity + quantity);
    setLocation('/cart');
  };
  const buyNow = () => {
    redirectToShopifyCheckout(quantity);
  };
  const faqs = [
    ['What does the kit include?', 'The 3-in-1 roadside kit includes a 5-ton electric hydraulic jack, an impact wrench, a tyre inflator / compressor, and a rugged carrying case.'],
    ['How is the jack powered?', 'The listing describes dual power supply: 12V vehicle power and battery power.'],
    ['What price is shown?', 'The supplied listing shows $29.90, reduced from $119.99.'],
    ['Is the kit in stock?', 'Yes. The supplied listing shows the kit as in stock.'],
    ['Is delivery included?', 'Free delivery shown on the supplied listing.'],
  ];

  return (
    <div className="site-shell">
      <SiteHeader />

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
                <img src={productImages[activeImage]} alt={`Diydeg Drive electric hydraulic car jack kit — product photo ${activeImage + 1}`} fetchPriority="high" />
                <figcaption className="gallery-count">PRODUCT PHOTOS / {String(activeImage + 1).padStart(2, '0')} OF {String(productImages.length).padStart(2, '0')}</figcaption>
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
                    data-testid={`button-gallery-photo-${index + 1}`}
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
              <h1 className="product-purchase-title" id="product-purchase-title">Electric Hydraulic Car Jack Kit — 5 Ton 12V</h1>
              <div className="product-rating-summary" role="img" aria-label="The supplied product listing reports 4.9 out of 5 from 5,142 reviews">
                <strong>4.9</strong>
                <span className="product-rating-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}</span>
                <span>5,142 customer reviews</span>
                <small>Rating shown on the supplied listing; reviews were not collected by Diydeg Drive.</small>
              </div>
              <div className="product-price-row">
                <div className="product-current-price"><span>$</span><strong>29</strong><sup>.90</sup></div>
                <del className="product-old-price">$119.99</del>
              </div>
              <p className="product-savings">Save $90.09 (75%)</p>
              <p className="product-stock-status">In stock · as shown on the supplied listing</p>
              <ul className="product-highlights">
                {[
                  '5-ton high lifting capacity',
                  'Dual power supply (12V / battery)',
                  '3-in-1 kit: jack, impact wrench, and inflator',
                  'Rugged professional carrying case',
                ].map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
              </ul>
              <div className="product-quantity-row">
                <span>Quantity</span>
                <div className="product-quantity-control">
                   <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} data-testid="button-product-quantity-decrease"><Minus size={14} /></button>
                   <output aria-label="Quantity" aria-live="polite" data-testid="value-product-quantity">{quantity}</output>
                   <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(99, current + 1))} data-testid="button-product-quantity-increase"><Plus size={14} /></button>
                </div>
              </div>
              <div className="product-buy-actions">
                 <button className="product-add-button" type="button" onClick={addToBasket} aria-describedby="product-checkout-note" data-testid="button-add-to-basket">Add to basket</button>
                 <button className="product-buy-button" type="button" onClick={buyNow} aria-describedby="product-checkout-note" data-testid="button-gallery-buy">Buy now</button>
              </div>
              <div className="product-assurance">
                <span><Truck size={15} />Free delivery shown on the supplied listing</span>
                <span><ShieldCheck size={15} />Secure checkout via Shopify</span>
              </div>
              <PaymentBrandMarks />
               <p className="product-checkout-note" id="product-checkout-note">Add to basket saves this selection locally and opens the basket. Buy now goes directly to secure Shopify checkout.</p>
            </aside>
          </div>
        </section>

        <div className="signal-strip">
          <div className="container signal-grid">
            <div className="signal-item"><Wrench size={20} /><div><span>5-ton hydraulic jack</span><small>Electric roadside lifting</small></div></div>
            <div className="signal-item"><BatteryCharging size={20} /><div><span>12V + battery supply</span><small>Dual power setup</small></div></div>
            <div className="signal-item"><Wind size={20} /><div><span>Tyre inflator</span><small>Compressor included</small></div></div>
            <div className="signal-item"><PackageCheck size={20} /><div><span>3-in-1 kit</span><small>Case, wrench, and jack</small></div></div>
          </div>
        </div>

        <section className="section" id="features">
          <div className="container">
            <div className="intro-grid">
              <div><div className="eyebrow">Why it exists / 02</div><h2 className="section-title">One kit.<br />Less searching.</h2></div>
              <p>When a roadside stop interrupts the day, the useful answer is close at hand. Diydeg Drive brings the powered jack, impact wrench, inflator, and carrying case into one straightforward kit.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card large">
                <span className="card-index">01 / LIFT</span>
                <div><div className="feature-icon"><Wrench size={20} /></div><h3>Built around a powered 5-ton hydraulic jack.</h3><p>Electric lifting is the centre of the kit, with a 12V and battery power setup listed for roadside use.</p></div>
                <div className="mono feature-foot">ELECTRIC HYDRAULIC / ROADSIDE KIT</div>
              </article>
              <article className="feature-card"><span className="card-index">02</span><div className="feature-icon"><Wind size={20} /></div><h3>Inflation is part of the plan.</h3><p>The supplied tyre inflator / compressor keeps another useful roadside tool in the case.</p></article>
              <article className="feature-card"><span className="card-index">03</span><div className="feature-icon"><BatteryCharging size={20} /></div><h3>Power where you need it.</h3><p>Use the dual power supply described in the listing: 12V vehicle power or battery power.</p></article>
            </div>
          </div>
        </section>

        <section className="section feedback-section" id="benefits">
          <div className="container">
            <div className="feedback-heading">
              <div>
                <div className="eyebrow">Customer feedback / 03</div>
                <h2 className="section-title">What drivers<br />are saying.</h2>
                <p className="feedback-source-note">
                  These reviews are shown on the supplied product listing and were not collected by Diydeg Drive.{' '}
                  <a href="https://norvella.biz/" target="_blank" rel="noopener noreferrer">View the original listing</a>.
                </p>
              </div>
            </div>
            <div className="feedback-grid">
              {customerReviews.map((review) => (
                <article className="feedback-card" key={review.author}>
                  <div className="review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={14} fill="currentColor" aria-hidden="true" />)}
                  </div>
                  <h3>{review.headline}</h3>
                  <p>“{review.quote}”</p>
                  <div className="feedback-card-footer"><span className="feedback-card-topic">{review.author}</span><span className="feedback-card-label">{review.date}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="kit">
          <div className="container camera-layout">
            <div className="camera-copy">
              <div className="eyebrow">Roadside setup / 04</div>
              <h2 className="section-title">The essentials<br />travel together.</h2>
              <p>The rugged carrying case keeps the 3-in-1 roadside kit together: electric hydraulic jack, impact wrench, and tyre inflator / compressor.</p>
              <div className="camera-list">
                <div><Check size={16} /><span>Electric hydraulic jack <small>5-ton capacity / 12V</small></span></div>
                <div><Check size={16} /><span>Impact wrench <small>Included in the roadside kit</small></span></div>
                <div><Check size={16} /><span>Tyre inflator / compressor <small>Included with the kit</small></span></div>
                <div><Check size={16} /><span>Rugged carrying case <small>Keep the kit together</small></span></div>
              </div>
            </div>
            <div className="kit-frame" aria-label="Electric jack kit contents">
              <img src={productImages[6]} alt="Diydeg Drive electric hydraulic car jack kit contents" loading="lazy" />
              <div className="kit-frame-label"><span>DIYDEG DRIVE</span><span>3-IN-1 ROADSIDE KIT</span></div>
            </div>
          </div>
        </section>

        <section className="section" id="specs">
          <div className="container spec-layout">
            <div><div className="eyebrow">The essentials / 05</div><h2 className="section-title">Specifics<br />that matter.</h2><p className="spec-copy">Details below reflect the product facts supplied for this Diydeg Drive page.</p></div>
            <div className="spec-table">
              <div className="spec-row"><span>Product</span><span>Electric hydraulic car jack kit</span></div>
              <div className="spec-row"><span>Capacity</span><span>5 ton</span></div>
              <div className="spec-row"><span>Power</span><span>12V + battery power</span></div>
              <div className="spec-row"><span>Kit format</span><span>3-in-1 roadside kit</span></div>
              <div className="spec-row"><span>Included tool</span><span>Impact wrench</span></div>
              <div className="spec-row"><span>Inflation</span><span>Tyre inflator / compressor</span></div>
              <div className="spec-row"><span>Storage</span><span>Rugged carrying case</span></div>
              <div className="spec-row"><span>Availability</span><span>In stock / Free delivery shown on the supplied listing</span></div>
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container kit-grid">
            <div><div className="eyebrow">In the box / 06</div><h2 className="section-title">Everything<br />in one case.</h2><p className="kit-copy">A compact roadside setup with the powered jack and the supporting tools drivers are likely to want close by.</p></div>
            <div className="kit-list">
              {['Electric hydraulic jack', 'Impact wrench', 'Tyre inflator / compressor', 'Rugged carrying case'].map((item, index) => <div className="kit-item" key={item} data-testid={`kit-item-${index}`}><Check size={16} />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="offer" id="offer">
          <div className="container">
            <div className="offer-card">
              <div className="offer-product-visual"><img src={productImages[0]} alt="Diydeg Drive electric hydraulic car jack kit" loading="lazy" /><span>DIYDEG DRIVE / 5-TON KIT</span></div>
              <div className="offer-copy"><div className="eyebrow">The roadside essential / 07</div><h2>Keep the useful<br />things together.</h2><p>Explore the electric jack kit, its dual power setup, included wrench, tyre inflator / compressor, and rugged case. The Diydeg checkout link will be connected before launch.</p></div>
              <div className="price-box">
                <span className="price-label">Listing price</span>
                <div className="prices"><span className="price-current">{PRODUCT_PRICE_LABEL}</span><span className="price-regular">$119.99</span></div>
                 <button className="button-primary checkout-placeholder" type="button" onClick={buyNow} aria-describedby="checkout-status" data-testid="button-offer-buy-now">Buy now</button>
                <PaymentBrandMarks />
                <div className="offer-status"><span><PackageCheck size={14} /> In stock</span><span>Free delivery shown on the supplied listing</span></div>
                 <div className="price-disclaimer" id="checkout-status">Buy now takes you directly to secure checkout. Payment is processed by Shopify.</div>
              </div>
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

function CartPage() {
  const cartQuantity = useCartQuantity();
  const [, setLocation] = useLocation();
  const subtotal = PRODUCT_PRICE * cartQuantity;
  const updateQuantity = (nextQuantity: number) => writeStoredQuantity(nextQuantity);
  const proceedToCheckout = () => {
    if (!cartQuantity) return;
    redirectToShopifyCheckout(cartQuantity);
  };

  return (
    <div className="commerce-page">
      <CommerceHeader />
      <main className="commerce-main">
        <div className="container">
          {cartQuantity === 0 ? (
            <section className="basket-card empty-basket" aria-labelledby="empty-basket-title">
              <div className="empty-basket-icon"><ShoppingBag size={24} /></div>
              <h2 id="empty-basket-title">Your basket is empty</h2>
              <p>Add the electric hydraulic car jack kit when you are ready. Your selection stays on this device until you change or remove it.</p>
              <Link className="commerce-button" href="/" data-testid="link-empty-basket-product">View the product</Link>
            </section>
          ) : (
            <div className="basket-layout">
              <section className="basket-card" aria-labelledby="basket-items-title">
                <div className="basket-card-heading">
                  <strong id="basket-items-title">Selected product</strong>
                  <span data-testid="status-basket-item-count">{cartQuantity} {cartQuantity === 1 ? 'item' : 'items'}</span>
                </div>
                <article className="basket-item" data-testid={`card-basket-product-${PRODUCT_ID}`}>
                  <div className="basket-item-image">
                    <img src={productImages[0]} alt={PRODUCT_TITLE} />
                  </div>
                  <div className="basket-item-copy">
                    <h2>{PRODUCT_TITLE}</h2>
                    <p>In stock · {DELIVERY_COPY}</p>
                    <div className="basket-item-controls">
                      <div className="quantity-control" aria-label="Basket quantity">
                         <button type="button" aria-label="Decrease basket quantity" disabled={cartQuantity <= 1} onClick={() => updateQuantity(cartQuantity - 1)} data-testid="button-basket-quantity-decrease"><Minus size={14} /></button>
                        <output aria-label="Basket quantity" aria-live="polite" data-testid="value-basket-quantity">{cartQuantity}</output>
                         <button type="button" aria-label="Increase basket quantity" disabled={cartQuantity >= 99} onClick={() => updateQuantity(cartQuantity + 1)} data-testid="button-basket-quantity-increase"><Plus size={14} /></button>
                      </div>
                      <button className="text-button" type="button" onClick={() => updateQuantity(0)} data-testid="button-remove-basket-product"><Trash2 size={13} /> Remove</button>
                    </div>
                  </div>
                  <strong className="basket-item-price" data-testid="value-basket-subtotal">{formatPrice(subtotal)}</strong>
                </article>
              </section>

              <aside className="summary-card" aria-labelledby="basket-summary-title">
                <h2 id="basket-summary-title">Order summary</h2>
                <div className="summary-lines">
                  <div className="summary-line"><span>Subtotal</span><strong data-testid="value-basket-summary-subtotal">{formatPrice(subtotal)}</strong></div>
                  <div className="summary-line"><span>Delivery</span><strong className="free" data-testid="value-basket-delivery">Free</strong></div>
                </div>
                <div className="summary-total"><span>Total</span><strong data-testid="value-basket-total">{formatPrice(subtotal)}</strong></div>
                <button className="commerce-button" type="button" onClick={proceedToCheckout} data-testid="button-cart-checkout">Checkout <ArrowUpRight size={14} /></button>
                <div className="summary-note">
                  <span><Truck size={13} />{DELIVERY_COPY}</span>
                  <span><ShieldCheck size={13} />Secure checkout via Shopify</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <CommerceFooter />
    </div>
  );
}

function CheckoutPage() {
  const [intent, setIntent] = useState<CheckoutIntent | null>(readCheckoutIntent);
  useEffect(() => {
    const sync = () => setIntent(readCheckoutIntent());
    window.addEventListener('diydeg-checkout-intent-updated', sync);
    return () => window.removeEventListener('diydeg-checkout-intent-updated', sync);
  }, []);
  const quantity = intent?.quantity ?? 0;
  const subtotal = PRODUCT_PRICE * quantity;

  return (
    <div className="commerce-page">
      <CommerceHeader />
      <main className="commerce-main">
        <div className="container">
          <div className="commerce-header">
            <div className="commerce-kicker">Diydeg Drive / checkout</div>
            <h1 className="commerce-title">Review before you go</h1>
            <p className="commerce-intro">Your order details are held here for a final review. This page does not request payment information or create a charge.</p>
          </div>

          {quantity === 0 ? (
            <section className="checkout-card checkout-empty" aria-labelledby="checkout-empty-title">
              <h2 id="checkout-empty-title">No order is ready yet</h2>
              <p>Start with the product page or add the kit to your basket first.</p>
              <div className="checkout-actions">
                <Link className="commerce-button" href="/" data-testid="link-checkout-empty-product">View the product</Link>
                <Link className="commerce-button secondary" href="/cart" data-testid="link-checkout-empty-basket">Go to basket</Link>
              </div>
            </section>
          ) : (
            <div className="checkout-layout">
              <section className="checkout-card" aria-labelledby="checkout-status-title">
                <h2 id="checkout-status-title">Checkout destination not connected</h2>
                <div className="connection-notice" role="status" data-testid="status-checkout-not-connected">
                  <div className="connection-notice-icon"><Info size={19} /></div>
                  <div>
                    <h3>No external checkout is available yet</h3>
                    <p>Diydeg Drive is not connected to a payment or storefront provider. We have not collected payment details, and no order or charge can be placed from this screen.</p>
                  </div>
                </div>
                <div className="checkout-actions">
                  <Link className="commerce-button secondary" href="/cart" data-testid="link-checkout-back-basket"><ArrowLeft size={14} /> Back to basket</Link>
                  <Link className="commerce-button" href="/" data-testid="link-checkout-back-product">Back to product</Link>
                </div>
              </section>

              <aside className="summary-card checkout-side" aria-labelledby="checkout-summary-title">
                <div className="checkout-product">
                  <div className="checkout-product-image"><img src={productImages[0]} alt={PRODUCT_TITLE} /></div>
                  <div><h3>{PRODUCT_TITLE}</h3><span data-testid="value-checkout-quantity">Quantity {quantity}</span></div>
                </div>
                <h2 id="checkout-summary-title" className="sr-only">Checkout order summary</h2>
                <div className="summary-lines" style={{ marginTop: '20px' }}>
                  <div className="summary-line"><span>Subtotal</span><strong data-testid="value-checkout-subtotal">{formatPrice(subtotal)}</strong></div>
                  <div className="summary-line"><span>Delivery</span><strong className="free" data-testid="value-checkout-delivery">Free</strong></div>
                </div>
                <div className="summary-total"><span>Total</span><strong data-testid="value-checkout-total">{formatPrice(subtotal)}</strong></div>
                <div className="summary-note">
                  <span><Truck size={13} />{DELIVERY_COPY}</span>
                  <span><ShieldCheck size={13} />Payment details are not requested.</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <CommerceFooter />
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/cart" component={CartPage} /><Route path="/checkout" component={CheckoutPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
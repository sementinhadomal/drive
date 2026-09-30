import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, BatteryCharging, Check, ChevronDown, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag, ShoppingCart, Star, Trash2, Truck, Wind, Wrench } from 'lucide-react';
import { FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb, FaCcVisa } from 'react-icons/fa';
import { SiApplepay, SiGooglepay } from 'react-icons/si';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import brandLogo from '@assets/diydeg-drive-logo-standard.png';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { CountryProvider, useCountry } from '@/context/CountryContext';

const queryClient = new QueryClient();

const PRODUCT_ID = 'diydeg-electric-hydraulic-jack-kit';
const PRODUCT_TITLE = 'Kit de Gato Hidráulico Eléctrico — 5 Toneladas 12V';
const CART_STORAGE_KEY = `diydeg-drive-cart-${PRODUCT_ID}`;

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

const customerReviews = [
  {
    author: 'Marcos T.',
    headline: 'Un verdadero salvavidas en carretera',
    date: '12 de Febrero 2026',
    rating: 5,
    quote: 'Tuve un pinchazo en la autopista y este kit hizo que cambiar el neumático fuera mucho más rápido y seguro que con un gato manual. La llave de impacto tiene fuerza suficiente para tuercas apretadas. Todo vehículo debería llevar uno.',
  },
  {
    author: 'Sara Benítez',
    headline: 'Perfecto para quien le cuesta usar gatos manuales',
    date: '5 de Enero 2026',
    rating: 5,
    quote: 'Siempre me costó tener la fuerza necesaria para los gatos tradicionales. Este gato eléctrico hace todo el trabajo por ti. Se conecta al encendedor del coche y levanta el auto en aproximadamente un minuto.',
  },
  {
    author: 'David H.',
    headline: 'Excelente calidad y maletín resistente',
    date: '28 de Diciembre 2025',
    rating: 5,
    quote: 'El maletín es muy robusto y mantiene todo organizado en la cajuela. El compresor incorporado es genial para revisar la presión de las llantas. Vale totalmente la pena por tranquilidad.',
  },
  {
    author: 'Javier Wilson',
    headline: 'Impresionante fuerza de elevación',
    date: '15 de Noviembre 2025',
    rating: 5,
    quote: 'Lo probé en mi camioneta SUV y levantó el vehículo sin ningún esfuerzo. El rango de altura es muy bueno y la luz LED del gato es muy útil de noche.',
  },
  {
    author: 'Roberto M.',
    headline: 'Solución todo en uno excelente',
    date: '3 de Noviembre 2025',
    rating: 5,
    quote: 'Ya no tengo que llevar tres herramientas diferentes. Hace todo. La llave de impacto quita los birlos en segundos sin esfuerzo físico. Muy recomendado.',
  },
  {
    author: 'Elena P.',
    headline: 'Gran producto, muy completo',
    date: '20 de Octubre 2025',
    rating: 4,
    quote: 'El kit es de excelente calidad y funciona a la perfección. Es una herramienta indispensable para viajes largos.',
  },
];

function PaymentBrandMarks() {
  const { country } = useCountry();
  return (
    <div className="payment-methods">
      <span className="payment-methods-label">Métodos de pago seguros en {country.name}</span>
      <div className="payment-brand-marks" role="img" aria-label="Visa, Mastercard, American Express, Discover, Diners Club, JCB, UnionPay, Apple Pay, y Google Pay">
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
  const { country, openCountryModal } = useCountry();

  return (
    <header className="topbar">
      <div className="container nav">
        <a className="brand" href="#top" data-testid="link-brand">
          <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
        </a>
        <nav className="nav-links" aria-label="Navegación principal">
          <a href="#features" data-testid="link-features">Características</a>
          <a href="#kit" data-testid="link-kit">Qué incluye</a>
          <a href="#specs" data-testid="link-specifications">Especificaciones</a>
          <a href="#faq" data-testid="link-faq">Preguntas</a>
        </nav>
        <div className="flex items-center gap-3">
          {/* Country Selector Pill */}
          <button
            type="button"
            onClick={openCountryModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Cambiar país y moneda"
            data-testid="button-country-selector"
          >
            <span className="text-base leading-none">{country.flag}</span>
            <span>{country.currency}</span>
            <ChevronDown size={13} className="opacity-70" />
          </button>

          <Link className="nav-cart" href="/cart" aria-label={`Abrir cesta (${cartQuantity})`} data-testid="link-cart">
            <span className="nav-cart-icon" aria-hidden="true">
              <ShoppingCart size={18} />
              {cartQuantity > 0 && <span className="nav-cart-count" data-testid="status-cart-count">{cartQuantity}</span>}
            </span>
            <span className="nav-cart-label">Cesta</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function CommerceHeader() {
  const cartQuantity = useCartQuantity();
  const { country, openCountryModal } = useCountry();

  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/" data-testid="link-commerce-brand">
          <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCountryModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            title="Cambiar país y moneda"
          >
            <span className="text-base leading-none">{country.flag}</span>
            <span>{country.currency}</span>
            <ChevronDown size={13} className="opacity-70" />
          </button>
          <Link className="nav-cart" href="/cart" aria-label={`Abrir cesta (${cartQuantity})`} data-testid="link-commerce-cart">
            <span className="nav-cart-icon" aria-hidden="true">
              <ShoppingCart size={18} />
              {cartQuantity > 0 && <span className="nav-cart-count" data-testid="status-commerce-cart-count">{cartQuantity}</span>}
            </span>
            <span className="nav-cart-label">Cesta</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function CommerceFooter() {
  return (
    <footer className="commerce-footer">
      <div className="container commerce-footer-row">
        <img src={brandLogo} alt="Diydeg Drive" />
        <span>Fotos oficiales del producto proporcionadas por el fabricante.</span>
        <span>Diydeg Drive • Todos los derechos reservados.</span>
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
  const { country, openCountryModal } = useCountry();

  const addToBasket = () => {
    writeStoredQuantity(cartQuantity + quantity);
    setLocation('/cart');
  };

  const buyNow = () => {
    redirectToShopifyCheckout(quantity);
  };

  const faqs = [
    ['¿Qué incluye el kit?', 'El kit de carretera 3 en 1 incluye: gato hidráulico eléctrico de 5 toneladas, llave de impacto eléctrica para tuercas, inflador/compresor de neumáticos con manómetro digital y maletín rígido de transporte.'],
    ['¿Cómo se alimenta eléctricamente?', 'Cuenta con doble alimentación: conéctalo a la toma de 12V del encendedor del auto o directamente a la batería del vehículo con las pinzas incluidas.'],
    ['¿Tiene fuerza para camionetas y SUVs?', 'Sí. Su capacidad de elevación hidráulica es de hasta 5 toneladas, suficiente para autos compactos, sedanes, SUVs y camionetas pick-up.'],
    ['¿Hay existencias disponibles?', 'Sí. Disponibilidad inmediata para entrega rápida en tu región.'],
    ['¿El envío tiene algún costo extra?', `${country.delivery}. Sin cargos ocultos al momento de pagar.`],
  ];

  return (
    <div className="site-shell">
      <SiteHeader />

      <main id="top">
        <section className="hero product-detail-hero">
          <div className="container product-detail-grid">
            <div className="product-gallery product-detail-gallery reveal" aria-label="Galería de fotos del producto">
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
                <img src={productImages[activeImage]} alt={`Diydeg Drive kit gato hidráulico eléctrico — foto ${activeImage + 1}`} fetchPriority="high" />
                <figcaption className="gallery-count">FOTOS DEL PRODUCTO / {String(activeImage + 1).padStart(2, '0')} DE {String(productImages.length).padStart(2, '0')}</figcaption>
              </figure>
              <div className="gallery-thumbnails" aria-label="Elegir foto del producto">
                {productImages.map((image, index) => (
                  <button
                    className={activeImage === index ? 'gallery-thumb active' : 'gallery-thumb'}
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-pressed={activeImage === index}
                    data-testid={`button-gallery-photo-${index + 1}`}
                  >
                    <img src={image} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <div className="gallery-pagination" role="group" aria-label="Elegir foto del producto">
                {productImages.map((image, index) => (
                  <button
                    className={activeImage === index ? 'gallery-pagination-button active' : 'gallery-pagination-button'}
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-pressed={activeImage === index}
                    data-testid={`button-gallery-dot-${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <aside className="product-purchase-card reveal delay-2" id="product-purchase" aria-labelledby="product-purchase-title">
              <h1 className="product-purchase-title" id="product-purchase-title">Kit de Gato Hidráulico Eléctrico — 5 Toneladas 12V</h1>
              <div className="product-rating-summary" role="img" aria-label="Calificación de 4.9 de 5 basada en 5,142 valoraciones">
                <strong>4.9</strong>
                <span className="product-rating-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}</span>
                <span>5,142 opiniones de clientes</span>
                <small>Valoración verificada de clientes satisfechos.</small>
              </div>

              <div className="product-price-row">
                <div className="product-current-price">
                  <strong>{country.priceDisplay.integer}</strong>
                  {country.priceDisplay.decimal && <sup>{country.priceDisplay.decimal}</sup>}
                  <span style={{ fontSize: '18px', marginLeft: '6px', fontWeight: 800, color: '#b52240' }}>{country.currency}</span>
                </div>
                <del className="product-old-price">{country.formattedOldPrice}</del>
              </div>
              <p className="product-savings">{country.savings}</p>
              <p className="product-stock-status">En existencia · Listo para envío</p>

              <ul className="product-highlights">
                {[
                  'Capacidad de carga pesada de 5 toneladas',
                  'Doble alimentación eléctrica (12V encendedor o batería)',
                  'Kit completo 3 en 1: gato eléctrico, llave de impacto y compresor',
                  'Maletín rígido profesional de transporte con advertencia reflectante',
                ].map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
              </ul>

              <div className="product-quantity-row">
                <span>Cantidad</span>
                <div className="product-quantity-control">
                   <button type="button" aria-label="Disminuir cantidad" onClick={() => setQuantity((current) => Math.max(1, current - 1))} data-testid="button-product-quantity-decrease"><Minus size={14} /></button>
                   <output aria-label="Cantidad" aria-live="polite" data-testid="value-product-quantity">{quantity}</output>
                   <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((current) => Math.min(99, current + 1))} data-testid="button-product-quantity-increase"><Plus size={14} /></button>
                </div>
              </div>

              <div className="product-buy-actions">
                 <button className="product-add-button" type="button" onClick={addToBasket} aria-describedby="product-checkout-note" data-testid="button-add-to-basket">Añadir a la cesta</button>
                 <button className="product-buy-button" type="button" onClick={buyNow} aria-describedby="product-checkout-note" data-testid="button-gallery-buy">Comprar ahora</button>
              </div>

              <div className="product-assurance">
                <span><Truck size={15} />{country.delivery}</span>
                <span><ShieldCheck size={15} />Pago seguro verificado por Shopify</span>
              </div>

              <PaymentBrandMarks />
              <p className="product-checkout-note" id="product-checkout-note">Añadir a la cesta guarda tu selección. Comprar ahora va directamente al checkout seguro de Shopify.</p>
            </aside>
          </div>
        </section>

        <div className="signal-strip">
          <div className="container signal-grid">
            <div className="signal-item"><Wrench size={20} /><div><span>Gato hidráulico 5T</span><small>Elevación rápida sin esfuerzo</small></div></div>
            <div className="signal-item"><BatteryCharging size={20} /><div><span>12V + Batería</span><small>Doble alimentación flexible</small></div></div>
            <div className="signal-item"><Wind size={20} /><div><span>Compresor integrado</span><small>Inflador rápido con manómetro</small></div></div>
            <div className="signal-item"><PackageCheck size={20} /><div><span>Kit 3 en 1</span><small>Maletín, llave y gato</small></div></div>
          </div>
        </div>

        <section className="section" id="features">
          <div className="container">
            <div className="intro-grid">
              <div><div className="eyebrow">Por qué existe / 02</div><h2 className="section-title">Un solo kit.<br />Cero complicaciones.</h2></div>
              <p>Cuando un imprevisto detiene tu viaje, la mejor respuesta es tener todo a mano. Diydeg Drive reúne el gato hidráulico eléctrico, la llave de impacto, el compresor y el maletín de transporte en una solución definitiva.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card large">
                <span className="card-index">01 / ELEVACIÓN</span>
                <div><div className="feature-icon"><Wrench size={20} /></div><h3>Diseñado sobre un potente gato hidráulico de 5 toneladas.</h3><p>La elevación eléctrica es el corazón del kit. Con solo presionar un botón, levanta el vehículo en menos de 2 minutos sin ningún esfuerzo físico.</p></div>
                <div className="mono feature-foot">HIDRÁULICO ELÉCTRICO / KIT DE CARRETERA</div>
              </article>
              <article className="feature-card"><span className="card-index">02</span><div className="feature-icon"><Wind size={20} /></div><h3>Inflador rápido incluido.</h3><p>El compresor de neumáticos incorporado te permite calibrar e inflar las ruedas en cualquier lugar con manómetro digital.</p></article>
              <article className="feature-card"><span className="card-index">03</span><div className="feature-icon"><BatteryCharging size={20} /></div><h3>Energía donde la necesitas.</h3><p>Usa la toma de encendedor de 12V del auto o conéctalo directamente a la batería con las pinzas de seguridad incluidas.</p></article>
            </div>
          </div>
        </section>

        <section className="section feedback-section" id="benefits">
          <div className="container">
            <div className="feedback-heading">
              <div>
                <div className="eyebrow">Opiniones de conductores / 03</div>
                <h2 className="section-title">Lo que dicen<br />quienes lo usan.</h2>
                <p className="feedback-source-note">
                  Opiniones recopiladas de conductores satisfechos en todo el mundo.
                </p>
              </div>
            </div>
            <div className="feedback-grid">
              {customerReviews.map((review) => (
                <article className="feedback-card" key={review.author}>
                  <div className="review-stars" role="img" aria-label={`${review.rating} de 5 estrellas`}>
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
              <div className="eyebrow">Todo a mano / 04</div>
              <h2 className="section-title">Las herramientas esenciales<br />viajan juntas.</h2>
              <p>El maletín rígido mantiene todo ordenado: gato hidráulico de 5 toneladas, llave de impacto de alto torque, compresor de neumáticos y cables de alimentación.</p>
              <div className="camera-list">
                <div><Check size={16} /><span>Gato hidráulico eléctrico <small>Capacidad 5 toneladas / 12V</small></span></div>
                <div><Check size={16} /><span>Llave de impacto eléctrica <small>Afloja birlos en segundos</small></span></div>
                <div><Check size={16} /><span>Compresor de neumáticos <small>Con manómetro digital</small></span></div>
                <div><Check size={16} /><span>Maletín rígido de transporte <small>Con señal reflectante de advertencia</small></span></div>
              </div>
            </div>
            <div className="kit-frame" aria-label="Contenido del kit de gato eléctrico">
              <img src={productImages[6]} alt="Contenido del kit de gato hidráulico eléctrico Diydeg Drive" loading="lazy" />
              <div className="kit-frame-label"><span>DIYDEG DRIVE</span><span>KIT DE EMERGENCIA 3 EN 1</span></div>
            </div>
          </div>
        </section>

        <section className="section" id="specs">
          <div className="container spec-layout">
            <div><div className="eyebrow">Especificaciones / 05</div><h2 className="section-title">Detalles<br />que importan.</h2><p className="spec-copy">Especificaciones técnicas certificadas para el kit de carretera Diydeg Drive.</p></div>
            <div className="spec-table">
              <div className="spec-row"><span>Producto</span><span>Kit de gato hidráulico eléctrico para coche</span></div>
              <div className="spec-row"><span>Capacidad de carga</span><span>5 Toneladas (5000 kg)</span></div>
              <div className="spec-row"><span>Alimentación</span><span>12V DC (encendedor o pinzas de batería)</span></div>
              <div className="spec-row"><span>Herramientas incluidas</span><span>Gato eléctrico + Llave de impacto + Compresor</span></div>
              <div className="spec-row"><span>Rango de elevación</span><span>155 mm a 450 mm</span></div>
              <div className="spec-row"><span>Presión máx. inflador</span><span>150 PSI con manómetro</span></div>
              <div className="spec-row"><span>Maletín</span><span>Rígido con triángulo de seguridad</span></div>
              <div className="spec-row"><span>Envío</span><span>{country.delivery}</span></div>
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container kit-grid">
            <div><div className="eyebrow">En la caja / 06</div><h2 className="section-title">Todo listo<br />en un maletín.</h2><p className="kit-copy">Un equipamiento completo para que nunca te quedes varado en el camino.</p></div>
            <div className="kit-list">
              {['Gato hidráulico eléctrico 5T', 'Llave de impacto eléctrica', 'Compresor de neumáticos digital', 'Maletín rígido con reflectante', 'Cable de encendedor 12V', 'Pinzas para batería', 'Fusibles y dados de recambio', 'Guantes y manual de instrucciones'].map((item, index) => <div className="kit-item" key={item} data-testid={`kit-item-${index}`}><Check size={16} />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="offer" id="offer">
          <div className="container">
            <div className="offer-card">
              <div className="offer-product-visual"><img src={productImages[0]} alt="Kit de gato hidráulico eléctrico Diydeg Drive" loading="lazy" /><span>DIYDEG DRIVE / KIT 5 TONELADAS</span></div>
              <div className="offer-copy">
                <div className="eyebrow">Seguridad para tu vehículo / 07</div>
                <h2>Ten siempre a mano<br />lo que necesitas.</h2>
                <p>Equipa tu cajuela con la mejor herramienta para resolver cualquier emergencia con neumáticos en minutos. Comprar ahora te lleva directamente al pago seguro en Shopify.</p>
              </div>
              <div className="price-box">
                <span className="price-label">Precio especial</span>
                <div className="prices">
                  <span className="price-current">{country.formattedPrice}</span>
                  <span className="price-regular">{country.formattedOldPrice}</span>
                </div>
                <button className="button-primary checkout-placeholder" type="button" onClick={buyNow} aria-describedby="checkout-status" data-testid="button-offer-buy-now">Comprar ahora</button>
                <PaymentBrandMarks />
                <div className="offer-status"><span><PackageCheck size={14} /> En existencia</span><span>{country.delivery}</span></div>
                <div className="price-disclaimer" id="checkout-status">Comprar ahora te lleva directamente al pago seguro en Shopify.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="container faq-layout">
            <div><div className="eyebrow">Preguntas frecuentes / 08</div><h2 className="section-title">Antes de salir<br />a la carretera.</h2></div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button className="faq-button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} data-testid={`button-faq-${index}`}><span>{question}</span><ChevronDown size={18} /></button>{openFaq === index && <div className="faq-answer" data-testid={`text-faq-answer-${index}`}>{answer}</div>}</div>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container footer-row"><img className="footer-brand-logo" src={brandLogo} alt="Diydeg Drive" /><span>Fotos oficiales del producto por Diydeg Drive.</span><span>Todos los derechos reservados.</span></div></footer>
    </div>
  );
}

function CartPage() {
  const cartQuantity = useCartQuantity();
  const [, setLocation] = useLocation();
  const { country, formatSubtotal } = useCountry();
  const subtotalFormatted = formatSubtotal(cartQuantity);

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
              <h2 id="empty-basket-title">Tu cesta está vacía</h2>
              <p>Añade el kit de gato hidráulico eléctrico cuando estés listo para continuar.</p>
              <Link className="commerce-button" href="/" data-testid="link-empty-basket-product">Ver el producto</Link>
            </section>
          ) : (
            <div className="basket-layout">
              <section className="basket-card" aria-labelledby="basket-items-title">
                <div className="basket-card-heading">
                  <strong id="basket-items-title">Producto seleccionado</strong>
                  <span data-testid="status-basket-item-count">{cartQuantity} {cartQuantity === 1 ? 'artículo' : 'artículos'}</span>
                </div>
                <article className="basket-item" data-testid={`card-basket-product-${PRODUCT_ID}`}>
                  <div className="basket-item-image">
                    <img src={productImages[0]} alt={PRODUCT_TITLE} />
                  </div>
                  <div className="basket-item-copy">
                    <h2>{PRODUCT_TITLE}</h2>
                    <p>En existencia · {country.delivery}</p>
                    <div className="basket-item-controls">
                      <div className="quantity-control" aria-label="Cantidad en la cesta">
                         <button type="button" aria-label="Disminuir cantidad" disabled={cartQuantity <= 1} onClick={() => updateQuantity(cartQuantity - 1)} data-testid="button-basket-quantity-decrease"><Minus size={14} /></button>
                        <output aria-label="Cantidad en la cesta" aria-live="polite" data-testid="value-basket-quantity">{cartQuantity}</output>
                         <button type="button" aria-label="Aumentar cantidad" disabled={cartQuantity >= 99} onClick={() => updateQuantity(cartQuantity + 1)} data-testid="button-basket-quantity-increase"><Plus size={14} /></button>
                      </div>
                      <button className="text-button" type="button" onClick={() => updateQuantity(0)} data-testid="button-remove-basket-product"><Trash2 size={13} /> Eliminar</button>
                    </div>
                  </div>
                  <strong className="basket-item-price" data-testid="value-basket-subtotal">{subtotalFormatted}</strong>
                </article>
              </section>

              <aside className="summary-card" aria-labelledby="basket-summary-title">
                <h2 id="basket-summary-title">Resumen del pedido</h2>
                <div className="summary-lines">
                  <div className="summary-line"><span>Subtotal</span><strong data-testid="value-basket-summary-subtotal">{subtotalFormatted}</strong></div>
                  <div className="summary-line"><span>Envío</span><strong className="free" data-testid="value-basket-delivery">Gratis</strong></div>
                </div>
                <div className="summary-total"><span>Total</span><strong data-testid="value-basket-total">{subtotalFormatted}</strong></div>
                <button className="commerce-button" type="button" onClick={proceedToCheckout} data-testid="button-cart-checkout">TRAMITAR PEDIDO <ArrowUpRight size={14} /></button>
                <div className="summary-note">
                  <span><Truck size={13} />{country.delivery}</span>
                  <span><ShieldCheck size={13} />Pago seguro verificado por Shopify</span>
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
  const cartQuantity = useCartQuantity();
  const quantity = cartQuantity || 1;

  useEffect(() => {
    redirectToShopifyCheckout(quantity);
  }, [quantity]);

  return (
    <div className="commerce-page">
      <CommerceHeader />
      <main className="commerce-main">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Redirigiendo al checkout seguro...</h2>
          <p>Por favor espera un momento mientras conectamos con Shopify.</p>
        </div>
      </main>
      <CommerceFooter />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
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
      <CountryProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CountryProvider>
    </QueryClientProvider>
  );
}

export default App;
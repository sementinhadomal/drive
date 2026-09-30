import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, Camera, Check, ChevronDown, Minus, Monitor, Plus, Radio, ShieldCheck, ShoppingBag, ShoppingCart, Smartphone, Star, Trash2, Truck, Wifi, Zap } from 'lucide-react';
import { FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb, FaCcVisa } from 'react-icons/fa';
import { SiApplepay, SiGooglepay } from 'react-icons/si';
import brandLogo from '@assets/diydeg-drive-logo-standard.png';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { CountryProvider, useCountry } from '@/context/CountryContext';

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
    topic: 'CarPlay inalámbrico + Android Auto',
    quote: 'Me encanta tener los mapas, llamadas y Spotify en una pantalla grande sin tener que cambiar la radio de fábrica del auto.',
  },
  {
    topic: 'Pantalla nítida de 10.26 pulgadas',
    quote: 'El tamaño de la pantalla es perfecto. La navegación por GPS se ve clara y no estorba la visibilidad mientras conduzco.',
  },
  {
    topic: 'Cámaras frontal y trasera',
    quote: 'La cámara de reversa se activa al instante al dar marcha atrás. Ambas graban en excelente calidad incluso de noche.',
  },
  {
    topic: 'Instalación sencilla en minutos',
    quote: 'Solo fue colocar el soporte en el tablero, conectar al encendedor y listo. Se conectó a mi iPhone en 10 segundos.',
  },
  {
    topic: 'Conexión de audio sin cables',
    quote: 'Uso la transmisión FM para escuchar el sonido en las bocinas del coche y se escucha nítido y sin interferencias.',
  },
  {
    topic: 'Kit muy completo',
    quote: 'Trae todo lo necesario: cables, cámara trasera, soporte y cargador. Gran relación calidad-precio.',
  },
];

const CART_STORAGE_KEY = 'diydeg-drive-cart-quantity';
const PRODUCT_TITLE = 'Pantalla Inalámbrica CarPlay 10.26"';
const PRODUCT_SUMMARY = 'Apple CarPlay y Android Auto inalámbricos, con soporte para cámara frontal y trasera.';
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

function StoreHeader() {
  const [cartQuantity] = useStoredCartQuantity();
  const { country, openCountryModal } = useCountry();

  return (
    <header className="topbar">
      <div className="container nav">
        <Link className="brand" href="/" data-testid="link-brand">
          <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
        </Link>
        <div className="flex items-center gap-3">
          {/* Country Selector Button */}
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

          {/* Cart Link */}
          <Link className="nav-cart" href="/cart" aria-label={`Abrir cesta (${cartQuantity})`} data-testid="link-cart">
            <span className="nav-cart-icon" aria-hidden="true">
              <ShoppingCart size={18} />
              {cartQuantity > 0 && <span className="nav-cart-count" data-testid="text-cart-count">{cartQuantity}</span>}
            </span>
            <span className="nav-cart-label">Cesta</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <footer className="footer cart-footer">
      <div className="container footer-row">
        <img className="footer-brand-logo" src={brandLogo} alt="Diydeg Drive" />
        <span>Fotos oficiales del producto suministradas por el fabricante.</span>
        <span>Diydeg Drive • Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

function OrderSummary({ quantity }: { quantity: number }) {
  const { formatSubtotal, country } = useCountry();
  const subtotalFormatted = formatSubtotal(quantity);

  return (
    <>
      <div className="summary-lines">
        <div className="summary-line">
          <span>Subtotal</span>
          <strong data-testid="text-subtotal">{subtotalFormatted}</strong>
        </div>
        <div className="summary-line delivery">
          <span>Envío</span>
          <strong data-testid="text-delivery">Gratis</strong>
        </div>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong data-testid="text-total">{subtotalFormatted}</strong>
      </div>
    </>
  );
}

function Cart() {
  const [quantity, setQuantity] = useStoredCartQuantity();
  const { country, formatSubtotal } = useCountry();
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
                    <span id="cart-items-title">Producto</span>
                    <span data-testid="text-cart-item-count">{quantity} {quantity === 1 ? 'unidad' : 'unidades'}</span>
                  </div>
                  <article className="cart-product-row" data-testid="row-cart-product">
                    <div className="cart-product-image">
                      <img src={PRODUCT_IMAGE} alt={PRODUCT_TITLE} />
                    </div>
                    <div className="cart-product-meta">
                      <h2>{PRODUCT_TITLE}</h2>
                      <p>{PRODUCT_SUMMARY}</p>
                      <div className="cart-product-actions">
                        <div className="cart-quantity" aria-label="Cantidad en la cesta">
                          <button type="button" aria-label="Disminuir cantidad" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)} data-testid="button-cart-decrease"><Minus size={13} /></button>
                          <output aria-label="Cantidad en la cesta" data-testid="value-cart-quantity">{quantity}</output>
                          <button type="button" aria-label="Aumentar cantidad" disabled={quantity >= 99} onClick={() => setQuantity(quantity + 1)} data-testid="button-cart-increase"><Plus size={13} /></button>
                        </div>
                        <button className="cart-remove" type="button" onClick={() => setQuantity(0)} data-testid="button-cart-remove">
                          <Trash2 size={12} aria-hidden="true" /> Eliminar
                        </button>
                      </div>
                    </div>
                    <strong className="cart-product-price" data-testid="text-cart-line-total">{formatSubtotal(quantity)}</strong>
                  </article>
                </>
              ) : (
                <div className="cart-empty" data-testid="status-cart-empty">
                  <div className="cart-empty-icon"><ShoppingBag size={20} aria-hidden="true" /></div>
                  <h2>Tu cesta está vacía.</h2>
                  <p>Selecciona la pantalla Diydeg desde la página del producto para comenzar tu pedido.</p>
                  <Link className="cart-back-link" href="/" data-testid="link-empty-cart-product"><ArrowLeft size={14} /> Volver al producto</Link>
                </div>
              )}
            </section>
            <aside className="cart-summary" aria-labelledby="cart-summary-title">
              <h2 id="cart-summary-title">Resumen del pedido</h2>
              {hasProduct ? (
                <>
                  <OrderSummary quantity={quantity} />
                  <button className="cart-checkout-button" type="button" onClick={goToCheckout} data-testid="button-cart-checkout">TRAMITAR PEDIDO</button>
                  <div className="cart-trust">
                    <span><Truck size={12} aria-hidden="true" /> {country.delivery}</span>
                    <span><ShieldCheck size={12} aria-hidden="true" /> Pago seguro protegido por Shopify</span>
                  </div>
                </>
              ) : (
                <div className="checkout-empty" data-testid="status-cart-summary-empty">
                  <strong>Ningún producto seleccionado.</strong><br />El resumen aparecerá cuando añadas la pantalla.
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
  const quantity = cartQuantity || 1;
  const { country } = useCountry();

  useEffect(() => {
    redirectToShopifyCheckout(quantity);
  }, [quantity]);

  return (
    <div className="cart-shell">
      <StoreHeader />
      <main className="checkout-main">
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Redirigiendo al checkout seguro...</h2>
          <p>Por favor espera un momento mientras conectamos con Shopify.</p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}

function PaymentBrandMarks() {
  const { country } = useCountry();
  return (
    <div className="purchase-payment">
      <span className="purchase-payment-label">Métodos de pago seguros en {country.name}</span>
      <div className="gallery-card-brands" role="img" aria-label="Visa, Mastercard, American Express, Discover, Diners Club, JCB, UnionPay, Apple Pay, y Google Pay">
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
  const { country, openCountryModal } = useCountry();

  const addToBasket = () => {
    setCartQuantity(cartQuantity + quantity);
    setLocation('/cart');
  };

  const buyNow = () => {
    redirectToShopifyCheckout(quantity);
  };

  const faqs = [
    ['¿Reemplaza la radio original de mi auto?', 'No. Diydeg es una pantalla independiente diseñada para instalarse sobre el tablero sin desmontar ni alterar el estéreo de fábrica.'],
    ['¿Cómo se transmite el sonido a las bocinas del coche?', 'Puedes usar el cable de audio AUX incluido o sintonizar de manera inalámbrica a través de una frecuencia FM libre en la radio de tu coche.'],
    ['¿Incluye tarjeta de memoria para la grabación?', 'No. Para usar la función de grabación de video frontal y posterior se debe insertar una tarjeta MicroSD estándar por separado.'],
    ['¿Qué incluye la caja?', 'Pantalla de 10.26", cargador para encendedor de 12V, cable de extensión, cámara trasera impermeable, cable AUX, soporte adhesivo con tornillos y manual en español.'],
    ['¿Cuál es el periodo de garantía?', 'El producto cuenta con 120 días de garantía directa del fabricante.'],
  ];

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container nav">
          <a className="brand" href="#top" data-testid="link-brand">
            <img className="brand-logo" src={brandLogo} alt="Diydeg Drive" />
          </a>
          <nav className="nav-links" aria-label="Navegación principal">
            <a href="#features" data-testid="link-features">Características</a>
            <a href="#recording" data-testid="link-recording">Grabación</a>
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
              data-testid="button-country-selector-nav"
            >
              <span className="text-base leading-none">{country.flag}</span>
              <span>{country.currency}</span>
              <ChevronDown size={13} className="opacity-70" />
            </button>

            <Link className="nav-cart" href="/cart" aria-label={`Abrir cesta (${cartQuantity})`} data-testid="link-cart">
              <span className="nav-cart-icon" aria-hidden="true">
                <ShoppingCart size={18} />
                {cartQuantity > 0 && <span className="nav-cart-count" data-testid="text-cart-count">{cartQuantity}</span>}
              </span>
              <span className="nav-cart-label">Cesta</span>
            </Link>
          </div>
        </div>
      </header>

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
                <img
                  src={productImages[activeImage]}
                  alt={`Diydeg pantalla CarPlay portátil — foto ${activeImage + 1}`}
                  fetchPriority="high"
                />
                <figcaption className="gallery-count">
                  FOTOS DEL PRODUCTO / {String(activeImage + 1).padStart(2, '0')} DE {String(productImages.length).padStart(2, '0')}
                </figcaption>
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
              <h1 className="product-purchase-title" id="product-purchase-title">Pantalla Inalámbrica CarPlay 10.26"</h1>
              <p className="product-purchase-summary">Apple CarPlay y Android Auto inalámbricos, con soporte para cámara frontal y trasera 1080p.</p>
              <div className="product-proof-line"><strong>10.26 pulgadas</strong><span aria-hidden="true">•</span><span>CarPlay + Android Auto inalámbrico</span></div>
              
              <div className="product-price-row">
                <div className="product-current-price">
                  <span>{country.priceDisplay.symbol}</span>
                  <strong>{country.priceDisplay.integer}</strong>
                  {country.priceDisplay.decimal && <sup>{country.priceDisplay.decimal}</sup>}
                </div>
                <del className="product-old-price">{country.formattedOldPrice}</del>
              </div>
              <p className="product-savings">{country.savings}</p>

              <ul className="product-highlights">
                {[
                  'Pantalla táctil panorámica de 10.26 pulgadas',
                  'Apple CarPlay y Android Auto 100% inalámbricos',
                  'Cámaras frontal y trasera con grabación Full HD 1080p',
                  'Conexión de audio por AUX y FM sin cambiar la radio',
                ].map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
              </ul>

              <div className="product-quantity-row">
                <span>Cantidad</span>
                <div className="product-quantity-control">
                   <button type="button" aria-label="Disminuir cantidad" onClick={() => setQuantity((current) => Math.max(1, current - 1))} data-testid="button-product-decrease"><Minus size={14} /></button>
                   <output aria-label="Cantidad" aria-live="polite" data-testid="value-product-quantity">{quantity}</output>
                   <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((current) => Math.min(99, current + 1))} data-testid="button-product-increase"><Plus size={14} /></button>
                </div>
              </div>

              <div className="product-buy-actions">
                 <button className="product-add-button" type="button" onClick={addToBasket} aria-describedby="product-checkout-note" data-testid="button-add-to-basket">Añadir a la cesta</button>
                 <button className="product-buy-button" type="button" onClick={buyNow} aria-describedby="product-checkout-note" data-testid="button-gallery-buy">Comprar ahora</button>
              </div>

              <div className="product-assurance">
                <span><ShieldCheck size={15} />Garantía de fabricante de 120 días</span>
                <span><Truck size={15} />{country.delivery}</span>
              </div>

              <PaymentBrandMarks />
              <p className="product-checkout-note" id="product-checkout-note">Añadir a la cesta guarda tu selección. Comprar ahora va directamente al checkout seguro de Shopify.</p>
            </aside>
          </div>
        </section>

        <div className="signal-strip">
          <div className="container signal-grid">
            <div className="signal-item"><Monitor size={20} /><div><span>Pantalla de 10.26"</span><small>Visión táctil panorámica</small></div></div>
            <div className="signal-item"><Wifi size={20} /><div><span>CarPlay Inalámbrico</span><small>Apple + Android Auto</small></div></div>
            <div className="signal-item"><Camera size={20} /><div><span>Grabación Doble</span><small>1080p / ángulo 140°</small></div></div>
            <div className="signal-item"><Radio size={20} /><div><span>Audio Flexible</span><small>Salida AUX + Transmisor FM</small></div></div>
          </div>
        </div>

        <section className="section" id="features">
          <div className="container">
            <div className="intro-grid">
              <div><div className="eyebrow">Por qué existe / 02</div><h2 className="section-title">Una mejor<br />consola central.</h2></div>
              <p>Sin cambiar tu radio de fábrica. Sin instalaciones complejas. Diydeg coloca las mejores funciones de una conducción conectada en una pantalla dedicada que se instala en minutos sobre el tablero.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card large"><span className="card-index">01 / CONEXIÓN</span><div><div className="feature-icon"><Smartphone size={20} /></div><h3>Tus aplicaciones favoritas al alcance de tu mano.</h3><p>Apple CarPlay y Android Auto inalámbricos ponen mapas en tiempo real (Waze, Google Maps), llamadas manos libres, mensajes y tu música en una pantalla grande y visible.</p></div><div className="mono" style={{fontSize:'10px', color:'#c2d3e8'}}>INTERFAZ INALÁMBRICA / CONTROL TOTAL</div></article>
              <article className="feature-card"><span className="card-index">02</span><div className="feature-icon"><Zap size={20} /></div><h3>Hecho para sumar, no reemplazar.</h3><p>Mantén el estéreo original de tu coche intacto y disfruta de una pantalla moderna en el tablero.</p></article>
              <article className="feature-card"><span className="card-index">03</span><div className="feature-icon"><Radio size={20} /></div><h3>Elige la salida de audio.</h3><p>Conecta por cable AUX incluido o transmite el audio de forma inalámbrica a la radio FM de tu vehículo.</p></article>
            </div>
          </div>
        </section>

        <section className="section feedback-section" id="feedback">
          <div className="container">
            <div className="feedback-heading">
              <div>
                <div className="eyebrow">Opiniones de clientes / 03</div>
                <h2 className="section-title">Pequeña mejora.<br />Mucho mejor viaje.</h2>
              </div>
            </div>
            <div className="feedback-grid">
              {sampleFeedback.map((feedback, index) => (
                <article className="feedback-card" key={feedback.topic}>
                  <div className="feedback-stars" role="img" aria-label="Calificación ilustrativa de cinco estrellas">
                    {Array.from({ length: 5 }, (_, star) => <Star key={star} size={16} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />)}
                  </div>
                  <blockquote>“{feedback.quote}”</blockquote>
                  <div className="feedback-card-footer">
                    <span className="feedback-card-topic">{feedback.topic}</span>
                    <span className="feedback-card-label">Testimonio {String(index + 1).padStart(2, '0')}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="recording">
          <div className="container camera-layout">
            <div className="camera-copy">
              <div className="eyebrow">Seguridad en ruta / 04</div>
              <h2 className="section-title">Dos ángulos.<br />Total tranquilidad.</h2>
              <p>Las cámaras frontal y trasera ofrecen un registro visual constante. Ambas graban en Full HD 1080p con un ángulo de visión de 140 grados y grabación en bucle continua.</p>
              <div className="camera-list">
                <div><Check size={16} /><span>Grabación delantera <small>1080p / 140° de visión</small></span></div>
                <div><Check size={16} /><span>Cámara de reversa <small>1080p / asistencia de estacionamiento</small></span></div>
                <div><Check size={16} /><span>Grabación en bucle <small>Tarjeta de memoria se vende por separado</small></span></div>
              </div>
            </div>
            <div className="recording-frame" aria-label="Ilustración de la vista de grabación">
              <div className="rec-road" />
              <div className="recording-ui">
                <div className="rec-top"><span className="rec-dot">REC / FRONTAL</span><span>1080P&nbsp;&nbsp;140°</span></div>
                <span className="rec-label">REGISTRO / 09:41:18</span>
                <div className="rec-bottom"><span>GRABACIÓN CONTINUA</span><span>CAM 01</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="specs">
          <div className="container spec-layout">
            <div><div className="eyebrow">Lo esencial / 05</div><h2 className="section-title">Detalles<br />que importan.</h2><p className="spec-copy">Un kit completo con las prestaciones que los conductores realmente necesitan en su día a día.</p></div>
            <div className="spec-table">
              <div className="spec-row"><span>Pantalla</span><span>Táctil panorámica de 10.26 pulgadas</span></div>
              <div className="spec-row"><span>Conectividad móvil</span><span>Apple CarPlay y Android Auto inalámbricos</span></div>
              <div className="spec-row"><span>Cámara delantera</span><span>1080p / 140° de ángulo</span></div>
              <div className="spec-row"><span>Cámara trasera</span><span>1080p / 140° de ángulo con líneas guía</span></div>
              <div className="spec-row"><span>Grabación de video</span><span>Grabación en bucle continua</span></div>
              <div className="spec-row"><span>Audio</span><span>Cable AUX + Transmisión por radio FM</span></div>
              <div className="spec-row"><span>Garantía</span><span>120 días de garantía de fabricante</span></div>
              <div className="spec-row"><span>Importante</span><span>Tarjeta MicroSD no incluida</span></div>
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container kit-grid">
            <div><div className="eyebrow">En la caja / 06</div><h2 className="section-title">Todo listo<br />para instalar.</h2><p className="kit-copy">El paquete incluye la pantalla principal, cableado, soporte para el tablero, cámara trasera y manual de uso.</p></div>
            <div className="kit-list">
              {['Pantalla 10.26"', 'Cargador de auto 12V', 'Cable de extensión', 'Cámara trasera', 'Cable de audio AUX', 'Soporte y tornillos', 'Manual de usuario'].map((item, index) => <div className="kit-item" key={item} data-testid={`kit-item-${index}`}><Check size={16} />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="offer" id="offer">
          <div className="container">
            <div className="offer-card">
              <div className="offer-product-visual">
                <img
                  src={productImages[0]}
                  alt="Diydeg pantalla CarPlay portátil 10.26 pulgadas"
                  loading="lazy"
                />
                <span>DIYDEG / PANTALLA 10.26"</span>
              </div>
               <div className="offer-copy">
                 <div className="eyebrow">Oferta especial / 07</div>
                 <h2>Más pantalla.<br />Menos complicaciones.</h2>
                 <p>Disfruta de navegación GPS, llamadas y música con la máxima comodidad. Comprar ahora te redirige directamente al checkout seguro de Shopify.</p>
               </div>
               <div className="price-box">
                 <span className="price-label">Precio especial</span>
                 <div className="prices">
                   <span className="price-current">{country.formattedPrice}</span>
                   <span className="price-regular">{country.formattedOldPrice}</span>
                 </div>
                 <button className="button-primary checkout-placeholder" type="button" onClick={buyNow} aria-describedby="checkout-status" data-testid="button-checkout-pending">Comprar ahora</button>
                 <PaymentBrandMarks />
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
      <StoreFooter />
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
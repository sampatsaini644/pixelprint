import { useEffect, useState } from 'react';
import './App.css';

const categoryCards = [
  {
    title: 'Gallery prints',
    text: 'Museum-quality paper with rich color depth and crisp lifelike detail.',
    tone: 'sunset',
  },
  {
    title: 'Canvas wraps',
    text: 'Ready-to-hang statement pieces designed for living rooms, offices, and studios.',
    tone: 'forest',
  },
  {
    title: 'Framed art',
    text: 'Modern framing options that elevate family photos, travel moments, and portraits.',
    tone: 'stone',
  },
];

const featuredProducts = [
  {
    name: 'Coastal Collection',
    price: 39,
    detail: '12" x 18" print',
    image: 'coast',
  },
  {
    name: 'City Lights',
    price: 54,
    detail: '18" x 24" print',
    image: 'city',
  },
  {
    name: 'Golden Hour',
    price: 68,
    detail: '20" x 30" framed',
    image: 'golden',
  },
];

const benefits = [
  'Premium archival paper',
  'Free shipping over $45',
  'Fast 2-day turnaround',
  'Gift-ready packaging',
];

const printSizes = [
  { value: '12 x 18', price: 39 },
  { value: '16 x 20', price: 49 },
  { value: '18 x 24', price: 59 },
  { value: '20 x 30', price: 69 },
];

const captionFonts = [
  { name: 'DM Sans', family: "'DM Sans', sans-serif" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif" },
  { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
];

const initialOrder = {
  product: 'Custom photo print',
  size: '12 x 18',
  quantity: 1,
  name: '',
  email: '',
  payment: 'Card ending in 4242',
};

function App() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [order, setOrder] = useState(initialOrder);
  const [confirmation, setConfirmation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [photoText, setPhotoText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textFont, setTextFont] = useState('DM Sans');
  const [textSize, setTextSize] = useState(40);
  const [textRotation, setTextRotation] = useState(0);
  const [captionPosition, setCaptionPosition] = useState({ horizontal: 50, vertical: 85 });

  const selectedSize = printSizes.find((size) => size.value === order.size) || printSizes[0];
  const selectedProduct = { name: 'Custom photo print', price: selectedSize.price };

  const subtotal = selectedProduct.price * Number(order.quantity || 1);
  const shipping = subtotal > 0 ? 8 : 0;
  const total = subtotal + shipping;

  const updateOrder = (field, value) => {
    setOrder((currentOrder) => ({
      ...currentOrder,
      [field]: value,
    }));
  };

  const moveCaptionToPointer = (event) => {
    const preview = event.currentTarget.closest('.photo-preview');
    const bounds = preview.getBoundingClientRect();
    const horizontal = ((event.clientX - bounds.left) / bounds.width) * 100;
    const vertical = ((event.clientY - bounds.top) / bounds.height) * 100;

    setCaptionPosition({
      horizontal: Math.max(8, Math.min(92, horizontal)),
      vertical: Math.max(8, Math.min(92, vertical)),
    });
  };

  const handleCaptionKeyDown = (event) => {
    const step = event.shiftKey ? 5 : 1;
    const movement = {
      ArrowLeft: { horizontal: -step, vertical: 0 },
      ArrowRight: { horizontal: step, vertical: 0 },
      ArrowUp: { horizontal: 0, vertical: -step },
      ArrowDown: { horizontal: 0, vertical: step },
    }[event.key];

    if (!movement) return;

    event.preventDefault();
    setCaptionPosition((position) => ({
      horizontal: Math.max(8, Math.min(92, position.horizontal + movement.horizontal)),
      vertical: Math.max(8, Math.min(92, position.vertical + movement.vertical)),
    }));
  };

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setConfirmation('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setConfirmation('Please choose an image smaller than 20 MB.');
      event.target.value = '';
      return;
    }

    setConfirmation('');
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoName(file.name);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!photoUrl) {
      setConfirmation('Please upload a photo before placing your order.');
      return;
    }

    if (!order.name.trim() || !order.email.trim()) {
      setConfirmation('Please enter your name and email before placing the order.');
      return;
    }

    setConfirmation(
      `Thanks, ${order.name}! Your ${order.size} custom photo print order is ready. We will email the confirmation to ${order.email}.`
    );
    setOrder(initialOrder);
    setPhotoUrl('');
    setPhotoName('');
    setOrderOpen(false);
  };

  if (orderOpen) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <div className="brand" aria-label="PixelPrint home">
            <span className="brand-mark">P</span>
            PixelPrint
          </div>
          <button type="button" className="cta-button secondary" onClick={() => setOrderOpen(false)}>
            Back to shop
          </button>
        </header>

        <main className="checkout-shell">
          <section className="checkout-summary">
            <p className="eyebrow">Order summary</p>
            <div className="checkout-product">
              {photoUrl ? (
                <img className="small-product-image" src={photoUrl} alt="Your uploaded photo" />
              ) : (
                <div className="small-product-image photo-placeholder" aria-hidden="true" />
              )}
              <div>
                <h2>{selectedProduct.name}</h2>
                <p>{order.size}</p>
              </div>
            </div>

            <div className="checkout-lines">
              <div className="checkout-line">
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              <div className="checkout-line">
                <span>Shipping</span>
                <strong>${shipping}</strong>
              </div>
              <div className="checkout-line total-line">
                <span>Total</span>
                <strong>${total}</strong>
              </div>
            </div>
          </section>

          <section className="checkout-form-wrap section-card">
            <div className="section-heading split">
              <div>
                <p className="eyebrow">Start your custom order</p>
                <h2>Build your print.</h2>
              </div>
            </div>

            <form className="order-form" onSubmit={handleSubmit}>
              {confirmation && <p className="form-message" role="alert">{confirmation}</p>}

              <section className="photo-editor" aria-label="Upload and customize your photo">
                <div className="photo-editor-tools">
                  <div>
                    <p className="eyebrow">Your photo</p>
                    <h3>Make it yours.</h3>
                  </div>
                  <label className="photo-upload-button" htmlFor="photo-upload">
                    {photoUrl ? 'Choose another photo' : 'Upload a photo'}
                  </label>
                  <input
                    className="visually-hidden"
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  <p className="photo-file-name">{photoName || 'JPG, PNG, or WEBP. Up to 20 MB.'}</p>

                  <div className="form-field">
                    <label htmlFor="photo-text">Text on your photo</label>
                    <input
                      id="photo-text"
                      type="text"
                      maxLength="80"
                      placeholder="Add a caption or date"
                      value={photoText}
                      onChange={(event) => setPhotoText(event.target.value)}
                    />
                  </div>

                  <div className="text-style-controls">
                    <div className="form-field">
                      <label htmlFor="text-font">Font</label>
                      <select
                        id="text-font"
                        value={textFont}
                        onChange={(event) => setTextFont(event.target.value)}
                      >
                        {captionFonts.map((font) => (
                          <option key={font.name} value={font.name}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field color-field">
                      <label htmlFor="text-color">Text color</label>
                      <input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(event) => setTextColor(event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field range-field">
                    <label htmlFor="text-size">Text size <span>{textSize}px</span></label>
                    <input
                      id="text-size"
                      type="range"
                      min="16"
                      max="72"
                      step="2"
                      value={textSize}
                      onChange={(event) => setTextSize(Number(event.target.value))}
                    />
                  </div>

                  <div className="form-field range-field">
                    <label htmlFor="text-rotation">Text rotation <span>{textRotation} deg</span></label>
                    <input
                      id="text-rotation"
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={textRotation}
                      onChange={(event) => setTextRotation(Number(event.target.value))}
                    />
                  </div>

                  <div className="form-field range-field">
                    <label htmlFor="brightness">Brightness <span>{brightness}%</span></label>
                    <input
                      id="brightness"
                      type="range"
                      min="60"
                      max="140"
                      value={brightness}
                      onChange={(event) => setBrightness(Number(event.target.value))}
                    />
                  </div>

                  <div className="form-field range-field">
                    <label htmlFor="zoom">Zoom <span>{zoom}%</span></label>
                    <input
                      id="zoom"
                      type="range"
                      min="100"
                      max="160"
                      value={zoom}
                      onChange={(event) => setZoom(Number(event.target.value))}
                    />
                  </div>
                </div>

                <div
                  className="photo-preview"
                  style={{ aspectRatio: order.size.replace(' x ', ' / ') }}
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Preview of your custom print"
                      style={{ filter: `brightness(${brightness}%)`, transform: `scale(${zoom / 100})` }}
                    />
                  ) : (
                    <div className="photo-preview-empty">
                      <span aria-hidden="true">+</span>
                      <p>Your photo preview</p>
                    </div>
                  )}
                  {photoUrl && photoText.trim() && (
                    <span
                      className="photo-caption"
                      aria-label="Photo text. Use arrow keys to move it, or drag it with a pointer."
                      tabIndex={0}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.currentTarget.setPointerCapture(event.pointerId);
                        moveCaptionToPointer(event);
                      }}
                      onPointerMove={(event) => {
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          moveCaptionToPointer(event);
                        }
                      }}
                      onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
                      onKeyDown={handleCaptionKeyDown}
                      style={{
                        color: textColor,
                        fontFamily: captionFonts.find((font) => font.name === textFont)?.family,
                        fontSize: `${textSize}px`,
                        left: `${captionPosition.horizontal}%`,
                        top: `${captionPosition.vertical}%`,
                        transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                      }}
                    >
                      {photoText}
                    </span>
                  )}
                  <span className="preview-size">{order.size} in</span>
                </div>
              </section>

              <div className="form-column">
                <div className="form-field">
                  <label htmlFor="size">Print size</label>
                  <select
                    id="size"
                    value={order.size}
                    onChange={(event) => updateOrder('size', event.target.value)}
                  >
                    {printSizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.value} in - ${size.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="20"
                    value={order.quantity}
                    onChange={(event) => updateOrder('quantity', Number(event.target.value))}
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-field">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={order.name}
                    onChange={(event) => updateOrder('name', event.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@email.com"
                    value={order.email}
                    onChange={(event) => updateOrder('email', event.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="payment">Payment method</label>
                  <select
                    id="payment"
                    value={order.payment}
                    onChange={(event) => updateOrder('payment', event.target.value)}
                  >
                    <option value="Card ending in 4242">Card ending in 4242</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank transfer">Bank transfer</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="cta-button primary order-submit">
                Place order
              </button>
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="topbar">
          <div className="brand" aria-label="PixelPrint home">
            <span className="brand-mark">P</span>
            PixelPrint
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#">Prints</a>
            <a href="#">Canvases</a>
            <a href="#">Frames</a>
            <a href="#">Wall art</a>
            <a href="#">Offers</a>
          </nav>

          <div className="header-actions">
            <button className="nav-button ghost" type="button">
              Sign in
            </button>
            <button
              className="nav-button primary"
              type="button"
              onClick={() => setOrderOpen(true)}
            >
              Start order
            </button>
          </div>
        </div>

        <div className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Photo printing studio</p>
            <h1>Bring your favorite memories to life.</h1>
            <p className="subtitle">
              Premium photo prints, gallery wraps, and custom frames made to turn
              everyday moments into heirloom wall art.
            </p>

            <div className="hero-actions">
              <button className="cta-button primary" type="button" onClick={() => setOrderOpen(true)}>
                Shop now
              </button>
              <button className="cta-button secondary" type="button">
                View gallery
              </button>
            </div>

            <ul className="stats" aria-label="Store highlights">
              <li>
                <strong>15k+</strong>
                <span>happy customers</span>
              </li>
              <li>
                <strong>2-day</strong>
                <span>turnaround</span>
              </li>
              <li>
                <strong>4.9/5</strong>
                <span>average rating</span>
              </li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="Sample prints display">
            <div className="photo-card card-large">
              <div className="card-photo beach" />
              <div className="card-meta">
                <span>Summer escape</span>
                <strong>16 x 20</strong>
              </div>
            </div>

            <div className="photo-card card-small">
              <div className="card-photo portrait" />
              <div className="mini-badge">
                <span className="dot" />
                Best Seller
              </div>
            </div>

            <div className="floating-pill">★★★★★ Rated by 2,400+ shoppers</div>
          </div>
        </div>
      </header>

      {orderOpen && (
        <section className="order-panel section-card" aria-label="Order form">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Start your custom order</p>
              <h2>Build your print.</h2>
            </div>
            <button type="button" className="cta-button secondary" onClick={() => setOrderOpen(false)}>
              Close
            </button>
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-column">
              <div className="form-field">
                <label htmlFor="product">Product</label>
                <select
                  id="product"
                  value={order.product}
                  onChange={(event) => updateOrder('product', event.target.value)}
                >
                  {featuredProducts.map((product) => (
                    <option key={product.name} value={product.name}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="size">Print size</label>
                <select
                  id="size"
                  value={order.size}
                  onChange={(event) => updateOrder('size', event.target.value)}
                >
                  <option value="12 x 18">12 x 18</option>
                  <option value="16 x 20">16 x 20</option>
                  <option value="18 x 24">18 x 24</option>
                  <option value="20 x 30">20 x 30</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="20"
                  value={order.quantity}
                  onChange={(event) => updateOrder('quantity', Number(event.target.value))}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={order.name}
                  onChange={(event) => updateOrder('name', event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@email.com"
                  value={order.email}
                  onChange={(event) => updateOrder('email', event.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="payment">Payment method</label>
                <select
                  id="payment"
                  value={order.payment}
                  onChange={(event) => updateOrder('payment', event.target.value)}
                >
                  <option value="Card ending in 4242">Card ending in 4242</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank transfer">Bank transfer</option>
                </select>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-line">
                <span>Item</span>
                <strong>{order.product}</strong>
              </div>
              <div className="summary-line">
                <span>Size</span>
                <strong>{order.size}</strong>
              </div>
              <div className="summary-line">
                <span>Qty</span>
                <strong>{order.quantity}</strong>
              </div>
              <div className="summary-line">
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <strong>${shipping}</strong>
              </div>
              <div className="summary-line total-line">
                <span>Total</span>
                <strong>${total}</strong>
              </div>
            </div>

            <button type="submit" className="cta-button primary order-submit">
              Place order
            </button>
          </form>
        </section>
      )}

      {confirmation && <div className="confirmation-box">{confirmation}</div>}

      <main className="main-content">
        <section className="categories section-card" aria-label="Popular printing categories">
          <div className="section-heading">
            <p className="eyebrow">The studio favorites</p>
            <h2>Made for every room and memory.</h2>
          </div>

          <div className="category-grid">
            {categoryCards.map((category) => (
              <article key={category.title} className={`category-card ${category.tone}`}>
                <div className="category-art" aria-hidden="true" />
                <div className="category-copy">
                  <h3>{category.title}</h3>
                  <p>{category.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="featured section-card" aria-label="Featured products">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">New arrivals</p>
              <h2>Featured photo collections.</h2>
            </div>
            <button className="cta-button secondary" type="button">
              Explore all
            </button>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <article key={product.name} className="product-card">
                <div className={`product-image ${product.image}`} aria-hidden="true" />
                <div className="product-info">
                  <div className="product-row">
                    <h3>{product.name}</h3>
                    <span>${product.price}</span>
                  </div>
                  <p>{product.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="benefits-wrap" aria-label="Benefits">
          <div className="benefits-copy">
            <p className="eyebrow">Why choose us</p>
            <h2>Photo prints that feel premium from the first glance.</h2>
            <p>
              Crafted with pro-grade materials and a print process designed to preserve
              every tone, texture, and detail from your favorite moments.
            </p>
          </div>

          <ul className="benefits-list">
            {benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="testimonial section-card" aria-label="Customer review">
          <div className="testimonial-photo" aria-hidden="true" />
          <div className="testimonial-copy">
            <p className="eyebrow">Loved by families</p>
            <blockquote>
              “The colors looked incredible, the frame felt premium, and the whole piece
              arrived faster than expected. It now hangs above our living room sofa.”
            </blockquote>
            <div className="testimonial-author">
              <strong>Anna &amp; James</strong>
              <span>Photographer parents</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
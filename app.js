// Initialiser Telegram Web App
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

function haptic() {
  if (tg) tg.HapticFeedback?.impactOccurred('light');
}

// ===== CART CLASS =====
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
  }

  addItem(id, name, price, qty = 1) {
    const existing = this.items.find(item => item.id === id && item.price === price);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id, name, price, qty });
    }
    this.save();
  }

  removeItem(id, price) {
    this.items = this.items.filter(item => !(item.id === id && item.price === price));
    this.save();
  }

  updateQty(id, price, qty) {
    const item = this.items.find(item => item.id === id && item.price === price);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    updateBadge();
  }
}

const cart = new Cart();
let selectedDelivery = 'delivery';

const productsData = {
  sauvage: {
    name: 'DIOR SAUVAGE',
    brand: 'Dior',
    description: 'Un parfum boisé et épicé, léger et frais, parfait pour tous les jours.',
    video: 'assets/sauvage.mp4',
    sizes: [
      { ml: '50ml', price: 69 },
      { ml: '100ml', price: 99 }
    ]
  },
  bleu_chanel: {
    name: 'BLEU DE CHANEL',
    brand: 'Chanel',
    description: 'Un parfum frais et boisé avec des notes de citron et d\'épices.',
    video: 'assets/bleu_chanel.mp4',
    sizes: [
      { ml: '50ml', price: 79 },
      { ml: '100ml', price: 115 }
    ]
  },
  aventus: {
    name: 'CREED AVENTUS',
    brand: 'Creed',
    description: 'Une fragrance fruité avec des notes de pomme et de jasmin.',
    video: 'assets/aventus.mp4',
    sizes: [
      { ml: '50ml', price: 149 },
      { ml: '100ml', price: 249 }
    ]
  },
  baccarat: {
    name: 'BACCARAT ROUGE 540',
    brand: 'Francis Kurkdjian',
    description: 'Un parfum ambroisé et riche avec des notes florales délicates.',
    video: 'assets/baccarat.mp4',
    sizes: [
      { ml: '35ml', price: 99 },
      { ml: '70ml', price: 179 }
    ]
  },
  lemale: {
    name: 'LE MALE ELIXIR',
    brand: 'Jean Paul Gaultier',
    description: 'Un parfum sucré et gourmand avec des notes de vanille et d\'amande.',
    video: 'assets/lemale.mp4',
    sizes: [
      { ml: '75ml', price: 89 },
      { ml: '125ml', price: 119 }
    ]
  }
};

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

  if (pageId === 'page-panier') {
    renderCart();
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const pageId = item.dataset.page;
    showPage(pageId);
    haptic();
  });
});

// ===== PRODUCTS PAGE =====
function showProductList(container, keys) {
  container.innerHTML = '';
  keys.forEach(key => {
    const product = productsData[key];
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <div class="product-top">
        <img src="assets/${key}.jpg" alt="${product.name}">
      </div>
      <div class="product-bottom">
        <h2>${product.brand}</h2>
        <h3>${product.name}</h3>
        <button class="voir-btn">VOIR</button>
      </div>
    `;
    div.addEventListener('click', () => {
      openProductDetail(key);
      haptic();
    });
    container.appendChild(div);
  });
}

const productListContainer = document.querySelector('#page-produits .product-list');
showProductList(productListContainer, ['sauvage', 'bleu_chanel', 'aventus', 'baccarat', 'lemale']);

// ===== PRODUCT DETAIL =====
function openProductDetail(key) {
  const product = productsData[key];
  document.getElementById('product-video-src').src = product.video;
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-subtitle').textContent = product.brand;
  document.getElementById('product-description').textContent = product.description;

  const pricesContainer = document.getElementById('product-prices');
  pricesContainer.innerHTML = '';

  let selectedSize = null;
  let selectedPrice = null;

  product.sizes.forEach(size => {
    const div = document.createElement('div');
    div.className = 'price-option';
    div.innerHTML = `
      <span>${size.ml}</span>
      <strong>${size.price}€</strong>
    `;
    div.addEventListener('click', () => {
      document.querySelectorAll('.price-option').forEach(opt => opt.classList.remove('selected'));
      div.classList.add('selected');
      selectedSize = size.ml;
      selectedPrice = size.price;
      haptic();
    });
    pricesContainer.appendChild(div);
  });

  document.getElementById('add-to-cart-btn').onclick = () => {
    if (!selectedSize) {
      alert('Sélectionnez une taille');
      return;
    }
    cart.addItem(key, `${product.name} ${selectedSize}`, selectedPrice);
    haptic();
    alert('Ajouté au panier!');
    showPage('page-qg');
  };

  showPage('page-produit-detail');
}

document.getElementById('back-to-produits').addEventListener('click', () => {
  showPage('page-produits');
  haptic();
});

// ===== CART RENDERING =====
function renderCart() {
  const empty = document.getElementById('cart-empty');
  const content = document.getElementById('cart-content');

  if (cart.items.length === 0) {
    empty.style.display = 'block';
    content.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  content.style.display = 'block';

  const itemsContainer = document.getElementById('cart-items');
  itemsContainer.innerHTML = '';

  cart.items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.style.animationDelay = `${index * 0.05}s`;
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-detail">${item.price}€</div>
        <div class="cart-item-price">Total: ${(item.price * item.qty)}€</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn qty-minus">−</button>
        <div class="qty-display">${item.qty}</div>
        <button class="qty-btn qty-plus">+</button>
        <button class="remove-btn">✕</button>
      </div>
    `;

    itemDiv.querySelector('.qty-minus').addEventListener('click', () => {
      if (item.qty > 1) {
        cart.updateQty(item.id, item.price, item.qty - 1);
        renderCart();
      }
    });

    itemDiv.querySelector('.qty-plus').addEventListener('click', () => {
      cart.updateQty(item.id, item.price, item.qty + 1);
      renderCart();
    });

    itemDiv.querySelector('.remove-btn').addEventListener('click', () => {
      cart.removeItem(item.id, item.price);
      renderCart();
    });

    itemsContainer.appendChild(itemDiv);
  });

  const total = cart.getTotal();
  const deliveryInfo = getDeliveryInfo();
  const delivery = deliveryInfo.fee;
  const finalTotal = total + delivery;

  document.getElementById('cart-subtotal').textContent = total + '€';
  document.getElementById('cart-delivery').textContent = delivery === 0 ? 'Gratuit' : delivery + '€';
  document.getElementById('cart-total').textContent = finalTotal + '€';

  const itemCount = cart.items.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById('cart-items-count').textContent = itemCount;
  document.getElementById('cart-total-quick').textContent = finalTotal + '€';

  const deliveryName = deliveryInfo.name || 'Livraison';
  document.getElementById('delivery-label-name').textContent = deliveryName;

  updateOrderMessages();
}

function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (cart.items.length > 0) {
    badge.style.display = 'flex';
    badge.textContent = cart.items.length;
  } else {
    badge.style.display = 'none';
  }
}

// ===== DELIVERY =====
document.querySelectorAll('input[name="delivery"]').forEach(input => {
  input.addEventListener('change', () => {
    selectedDelivery = input.value;
    haptic();
    renderCart();
  });
});

function getDeliveryInfo() {
  const names = {
    delivery: '🚚 Livraison',
    pickup: '📍 Click & Collect',
    postal: '📬 Colis Postal'
  };
  return {
    name: names[selectedDelivery] || 'Livraison',
    fee: 0,
    min: 0
  };
}

// ===== ORDER MESSAGE =====
function generateOrderMessage() {
  const items = cart.items.map(item => {
    const total = item.price * item.qty;
    return `• ${item.name} - ${item.price}€ x${item.qty} = ${total}€`;
  }).join('\n');

  const subtotal = cart.getTotal();
  const deliveryInfo = getDeliveryInfo();
  const total = subtotal + deliveryInfo.fee;
  const address = document.getElementById('order-address').value;
  const info = document.getElementById('order-info').value;

  let message = `🛒 *COMMANDE PANAME DELIVERY*\n\n`;
  message += `📋 *PRODUITS:*\n${items}\n\n`;
  message += `💰 *RÉCAPITULATIF:*\n`;
  message += `Sous-total: ${subtotal}€\n`;
  message += `${deliveryInfo.name}: GRATUIT\n`;
  message += `*TOTAL: ${total}€*\n\n`;
  message += `🚚 *Mode de livraison:* ${deliveryInfo.name}\n`;

  if (address) {
    message += `📍 *Adresse:* ${address}\n`;
  }

  if (info) {
    message += `📝 *Infos:* ${info}\n`;
  }

  return message;
}

function updateOrderMessages() {
  const submitBtn = document.getElementById('submit-order-btn');
  const address = document.getElementById('order-address').value;

  if (!address || address.trim() === '') {
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
}

// ===== EVENT LISTENERS =====
document.addEventListener('input', (e) => {
  if (e.target.id === 'order-address' || e.target.id === 'order-info') {
    updateOrderMessages();
  }
});

// BOUTON PASSER COMMANDE - AFFICHER MODALE
document.addEventListener('click', (e) => {
  if (e.target.id === 'submit-order-btn') {
    const address = document.getElementById('order-address').value;
    if (!address || address.trim() === '') {
      alert('Veuillez remplir votre adresse');
      return;
    }
    haptic();
    const modal = document.getElementById('delivery-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }
});

// BOUTON WHATSAPP - OUVRIR WHATSAPP
document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-whatsapp-btn') {
    haptic();
    const message = generateOrderMessage();
    const waUrl = `https://wa.me/33758594530?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    const modal = document.getElementById('delivery-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
});

// BOUTON TELEGRAM - OUVRIR TELEGRAM
document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-telegram-btn') {
    haptic();
    const message = generateOrderMessage();
    const tgUrl = `https://t.me/PanameDelivery?text=${encodeURIComponent(message)}`;
    window.open(tgUrl, '_blank');
    const modal = document.getElementById('delivery-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
});

// BOUTON RETOUR MODALE
document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-cancel-btn') {
    haptic();
    const modal = document.getElementById('delivery-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
});

// FERMER MODALE EN CLIQUANT EN DEHORS
document.addEventListener('click', (e) => {
  const modal = document.getElementById('delivery-modal');
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// VIDER PANIER
document.addEventListener('click', (e) => {
  if (e.target.id === 'clear-cart-btn') {
    if (confirm('Vider le panier ?')) {
      haptic();
      cart.clear();
      selectedDelivery = 'delivery';
      document.getElementById('order-address').value = '';
      document.getElementById('order-info').value = '';
      renderCart();
    }
  }
});

// ===== SPLASH SCREEN =====
setTimeout(() => {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  showPage('page-qg');
}, 2000);

updateBadge();

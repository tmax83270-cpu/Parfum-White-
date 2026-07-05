const tg = window.Telegram.WebApp;
tg.expand();

function haptic() {
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

class Cart {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('panier');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('panier', JSON.stringify(this.items));
    this.updateBadge();
  }

  addItem(product, price, qty = 1) {
    const existingItem = this.items.find(item => item.id === product && item.price === price);
    
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      this.items.push({
        id: product,
        name: productsData[product].title,
        price: price,
        qty: qty
      });
    }
    
    this.saveCart();
    haptic();
  }

  removeItem(product, price) {
    this.items = this.items.filter(item => !(item.id === product && item.price === price));
    this.saveCart();
    haptic();
  }

  updateQty(product, price, qty) {
    const item = this.items.find(item => item.id === product && item.price === price);
    if (item) {
      item.qty = Math.max(1, qty);
      this.saveCart();
    }
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    const count = this.items.length;
    
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

const cart = new Cart();

const splash = document.getElementById('splash');
const app = document.getElementById('app');

setTimeout(() => {
  splash.style.transition = 'opacity 0.4s ease';
  splash.style.opacity = '0';
  
  setTimeout(() => {
    splash.style.display = 'none';
    app.style.display = 'block';

    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const qgPage = document.getElementById('page-qg');
    qgPage.style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const qgBtn = document.querySelector('.nav-item[data-page="page-qg"]');
    if (qgBtn) qgBtn.classList.add('active');

    cart.updateBadge();

  }, 400);

}, 2000);

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    haptic();

    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

    const pageId = btn.dataset.page;
    const page = document.getElementById(pageId);
    page.style.display = 'block';

    if (pageId === 'page-produits') {
      showProductList(document.querySelector('#page-produits .product-list'), Object.keys(productsData));
    }

    if (pageId === 'page-panier') {
      renderCart();
    }
  });
});

document.addEventListener('click', e => {
  if (e.target.closest('.qg-card')) {
    haptic();

    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const prodBtn = document.querySelector('.nav-item[data-page="page-produits"]');
    if (prodBtn) prodBtn.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const prodPage = document.getElementById('page-produits');
    prodPage.style.display = 'block';

    showProductList(
      document.querySelector('#page-produits .product-list'),
      Object.keys(productsData)
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

const productsData = {
  sauvage: {
    title: "DIOR SAUVAGE",
    subtitle: "Eau de Parfum",
    description: "Notes fraîches de bergamote associées à des accords boisés puissants.",
    video: "assets/sauvage.mp4",
    prices: [
      { qty: "50ml", price: 69 },
      { qty: "100ml", price: 99 }
    ]
  },

  bleu_chanel: {
    title: "BLEU DE CHANEL",
    subtitle: "Eau de Parfum",
    description: "Fragrance élégante et moderne aux notes boisées aromatiques.",
    video: "assets/bleu_chanel.mp4",
    prices: [
      { qty: "50ml", price: 79 },
      { qty: "100ml", price: 115 }
    ]
  },

  aventus: {
    title: "CREED AVENTUS",
    subtitle: "Eau de Parfum",
    description: "Parfum iconique aux notes fruitées et boisées.",
    video: "assets/aventus.mp4",
    prices: [
      { qty: "50ml", price: 149 },
      { qty: "100ml", price: 249 }
    ]
  },

  baccarat: {
    title: "BACCARAT ROUGE 540",
    subtitle: "Maison Francis Kurkdjian",
    description: "Une fragrance luxueuse et raffinée à la signature unique.",
    video: "assets/baccarat.mp4",
    prices: [
      { qty: "35ml", price: 99 },
      { qty: "70ml", price: 179 }
    ]
  },

  lemale: {
    title: "LE MALE ELIXIR",
    subtitle: "Jean Paul Gaultier",
    description: "Un parfum intense aux notes gourmandes et orientales.",
    video: "assets/lemale.mp4",
    prices: [
      { qty: "75ml", price: 89 },
      { qty: "125ml", price: 119 }
    ]
  }
};

function showProductList(container, keys) {
  container.innerHTML = '';
  keys.forEach((k, index) => {
    const prod = productsData[k];
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.product = k;
    div.style.animationDelay = `${index * 0.1}s`;
    div.innerHTML = `
      <div class="product-top"><img src="assets/${k}.jpg" alt="${prod.title}"></div>
      <div class="product-bottom">
        <h2>${prod.title}</h2>
        <h3>${prod.subtitle}</h3>
        <div class="voir-btn">VOIR</div>
      </div>
    `;
    container.appendChild(div);
  });
}

let currentProduct = null;
let currentPrice = null;

function openProductDetail(key) {
  haptic();

  const data = productsData[key];
  currentProduct = key;
  currentPrice = data.prices[0].price;

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const pageDetail = document.getElementById('page-produit-detail');
  pageDetail.style.display = 'block';

  document.getElementById('product-title').textContent = data.title;
  document.getElementById('product-subtitle').textContent = data.subtitle || '';
  document.getElementById('product-description').textContent = data.description;
  document.getElementById('product-video-src').src = data.video;
  document.getElementById('product-video').load();

  const pricesContainer = document.getElementById('product-prices');
  pricesContainer.innerHTML = '';
  data.prices.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'price-option';
    div.innerHTML = `<span>${p.qty}</span><strong>${p.price}€</strong>`;
    if (i === 0) div.classList.add('selected');
    div.addEventListener('click', () => {
      document.querySelectorAll('.price-option').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
      currentPrice = p.price;
    });
    pricesContainer.appendChild(div);
  });
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('voir-btn')) {
    openProductDetail(e.target.closest('.product').dataset.product);
  }
});

document.getElementById('back-to-produits').addEventListener('click', () => {
  haptic();
  document.getElementById('page-produit-detail').style.display = 'none';
  document.getElementById('page-produits').style.display = 'block';
});

document.getElementById('add-to-cart-btn').addEventListener('click', () => {
  if (currentProduct && currentPrice) {
    cart.addItem(currentProduct, currentPrice, 1);
    
    const btn = document.getElementById('add-to-cart-btn');
    const originalText = btn.textContent;
    btn.textContent = '✅ AJOUTÉ!';
    btn.style.background = '#25D366';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  }
});

// Gestion des options de livraison
let selectedDelivery = 'delivery';

document.querySelectorAll('input[name="delivery"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    selectedDelivery = e.target.value;
    renderCart();
  });
});

function getDeliveryInfo() {
  const deliveryOptions = {
    delivery: { name: 'Livraison', fee: 0, min: 0 },
    pickup: { name: 'Click & Collect', fee: 0, min: 0 },
    postal: { name: 'Colis Postal', fee: 0, min: 0 }
  };
  return deliveryOptions[selectedDelivery] || deliveryOptions.delivery;
}

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
  document.getElementById('cart-delivery').textContent = delivery === 0 ? 'GRATUIT' : delivery + '€';
  document.getElementById('cart-total').textContent = finalTotal + '€';

  // Mise à jour des liens WhatsApp et Telegram
  updateOrderMessages();
}

function generateOrderMessage() {
  const deliveryInfo = getDeliveryInfo();
  const total = cart.getTotal();
  const delivery = deliveryInfo.fee;
  const finalTotal = total + delivery;
  const address = document.getElementById('order-address').value;
  const info = document.getElementById('order-info').value;

  let message = '🛒 *COMMANDE PANAME DELIVERY*\n\n';
  message += '📋 *PRODUITS:*\n';
  
  cart.items.forEach(item => {
    message += `• ${item.name} - ${item.price}€ x${item.qty} = ${item.price * item.qty}€\n`;
  });

  message += `\n💰 *RÉCAPITULATIF:*\n`;
  message += `Sous-total: ${total}€\n`;
  message += `${deliveryInfo.name}: ${delivery === 0 ? 'GRATUIT' : delivery + '€'}\n`;
  message += `*TOTAL: ${finalTotal}€*\n\n`;
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
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      submitBtn.style.cursor = 'not-allowed';
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
  }
}

// Event listeners pour les champs du formulaire
document.addEventListener('input', (e) => {
  if (e.target.id === 'order-address' || e.target.id === 'order-info') {
    updateOrderMessages();
  }
});

// Bouton Annuler
document.addEventListener('click', (e) => {
  if (e.target.id === 'cancel-order-btn') {
    haptic();
    document.getElementById('order-address').value = '';
    document.getElementById('order-info').value = '';
  }
});

// Bouton Envoyer
document.addEventListener('click', (e) => {
  if (e.target.id === 'submit-order-btn') {
    const address = document.getElementById('order-address').value;
    if (!address) {
      alert('Veuillez remplir votre adresse');
      return;
    }
    haptic();
    const message = generateOrderMessage();
    const waUrl = `https://wa.me/33758594530?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }
});

document.getElementById('clear-cart-btn').addEventListener('click', () => {
  if (confirm('Vider le panier ?')) {
    haptic();
    cart.clear();
    selectedDelivery = 'delivery';
    document.getElementById('order-address').value = '';
    document.getElementById('order-info').value = '';
    renderCart();
  }
});

// Initialisation
cart.updateBadge();
updateOrderMessages();

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
  cali_weed_us: {
    title: "CALI WEED 🇺🇸",
    subtitle: "Oreoz ⬛️◻️",
    description: "Top qualité, Forte odeur, bonne defonce  .",
    video: "assets/cali_weed_us.mp4",
    prices: [{ qty: "5g", price: "50€" }, { qty: "10g", price: "100€" }]
  

  

  },
  cocaine: {
    title: "COCAINE ❄️",
    subtitle: "Ecaille ⚡️",
    description: "Produit de Top qualité ressors a 0.9 convient tout autant pour les fumeurs que les sniffeurs 👃.",
    video: "assets/cocaine.mp4",
    prices: [
      { qty: "1g", price: "60€" },
      { qty: "2g", price: "100€" },
      { qty: "5g", price: "240€" },
      { qty: "10g", price: "380€" }
    ]
  },

  filtre : {
    title: "FILTRÉ 120u ",
    subtitle: "Ruby 🍋‍🟩🍈 ",
    description: "Hash aromatique, texture unique, bonne defonce.",
    video: "assets/filtre.mp4",
    prices: [
      { qty: "5g", price: "50€" },
      { qty: "10g", price: "90€" },
      { qty: "20g", price: "160€" }
    ]
  },


  
  jaune_mousse: {
    title: "JAUNE MOUSSE ",
    subtitle: "Rainbow Gello 🇳🇱 ",
    description: "Hash aromatique, texture unique.",
    video: "assets/jaune_mousse.mp4",
    prices: [
      { qty: "10g", price: "50€" },
      { qty: "100g", price: "270€" },
      { qty: "1kilo", price: "2300€" }
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
  const delivery = total >= 50 ? 0 : 5;
  
  document.getElementById('cart-subtotal').textContent = total + '€';
  document.getElementById('cart-delivery').textContent = delivery + '€';
  document.getElementById('cart-total').textContent = (total + delivery) + '€';
}

document.getElementById('clear-cart-btn').addEventListener('click', () => {
  if (confirm('Vider le panier ?')) {
    haptic();
    cart.clear();
    renderCart();
  }
});

cart.updateBadge();

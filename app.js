// =======================================================
//                      TELEGRAM INIT
// =======================================================
const tg = window.Telegram.WebApp;
tg.expand();

// =======================================================
//                      HAPTIC VIBRATION
// =======================================================
function haptic() {
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
  }
}

// =======================================================
//                      SPLASH SCREEN 2s
// =======================================================
const splash = document.getElementById('splash');
const app = document.getElementById('app');

// Afficher le splash screen pendant 2 secondes puis basculer sur l'app
setTimeout(() => {
  splash.style.transition = 'opacity 0.4s ease';
  splash.style.opacity = '0';
  
  setTimeout(() => {
    splash.style.display = 'none';
    app.style.display = 'block';

    // --- Afficher QG au lieu de l'accueil ---
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none'); // cacher toutes les pages
    const qgPage = document.getElementById('page-qg');
    qgPage.style.display = 'block';

    // Activer bouton QG dans le nav
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const qgBtn = document.querySelector('.nav-item[data-page="page-qg"]');
    if (qgBtn) qgBtn.classList.add('active');

  }, 400); // attendre que le fade out se termine

}, 2000); // splash visible 2 secondes

// =======================================================
//                      NAVIGATION ONGLETS
// =======================================================
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    haptic();

    // Active le bouton cliqué
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Affiche la page correspondante
    const pageId = btn.dataset.page;
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';

    // Si Produits, afficher tous les produits
    if (pageId === 'page-produits') {
      showProductList(document.querySelector('#page-produits .product-list'), Object.keys(productsData));
    }
  });
});

// =======================================================
//              QG → REDIRECTION VERS PRODUITS
// =======================================================
document.querySelectorAll('.qg-card').forEach(card => {
  card.addEventListener('click', () => {
    haptic();

    // Désactiver tous les boutons du menu
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    // Activer le bouton Produits
    const produitsBtn = document.querySelector('.nav-item[data-page="page-produits"]');
    if (produitsBtn) produitsBtn.classList.add('active');

    // Cacher toutes les pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

    // Afficher la page Produits
    const produitsPage = document.getElementById('page-produits');
    produitsPage.style.display = 'block';

    // Charger tous les produits
    showProductList(
      document.querySelector('#page-produits .product-list'),
      Object.keys(productsData)
    );

    // Scroll en haut (optionnel mais pro)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


// =======================================================
//                      CARTES ACCUEIL
// =======================================================
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});

// =======================================================
//                      DONNÉES PRODUITS
// =======================================================
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

// =======================================================
//                      AFFICHAGE PRODUITS
// =======================================================
function showProductList(container, keys) {
  container.innerHTML = '';
  keys.forEach(k => {
    const prod = productsData[k];
    const div = document.createElement('div');
    div.className = 'product';
    div.dataset.product = k;
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

// =======================================================
//                      OUVRIR PRODUIT DÉTAILLÉ
// =======================================================
function openProductDetail(key) {
  haptic();

  const data = productsData[key];

  // Cacher toutes les pages
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('page-animate');
  });

  // Afficher page détail produit
  const pageDetail = document.getElementById('page-produit-detail');
  pageDetail.style.display = 'block';
  void pageDetail.offsetWidth;
  pageDetail.classList.add('page-animate');

  // Remplir infos produit
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
    div.textContent = `${p.qty} : ${p.price}`;
    if (i === 0) div.classList.add('selected');
    div.addEventListener('click', () => {
      document.querySelectorAll('.price-option').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
    });
    pricesContainer.appendChild(div);
  });
}

// =======================================================
//                      CLIQUER SUR VOIR
// =======================================================
document.addEventListener('click', e => {
  if (e.target.classList.contains('voir-btn')) {
    openProductDetail(e.target.closest('.product').dataset.product);
  }
});

// =======================================================
//                      BOUTON RETOUR PRODUIT
// =======================================================
document.getElementById('back-to-produits').addEventListener('click', () => {
  haptic();
  document.getElementById('page-produit-detail').style.display = 'none';
  document.getElementById('page-produits').style.display = 'block';
});

// =======================================================
//                      CONTACT (WhatsApp / Telegram)
// =======================================================
document.querySelectorAll('.contact-btn').forEach(btn => {
  btn.addEventListener('click', () => haptic());
});

// =======================================================
//                      NEIGE
// =======================================================
function createSnowflake() {
  const snowContainer = document.getElementById('snow-container');
  if (!snowContainer) return;

  const flake = document.createElement('div');
  flake.className = 'snowflake';
  flake.textContent = '❄';
  flake.style.left = Math.random() * window.innerWidth + 'px';
  flake.style.fontSize = (10 + Math.random() * 20) + 'px';
  flake.style.opacity = 0.5 + Math.random() * 0.5;

  const duration = 10 + Math.random() * 20;
  flake.style.animationDuration = duration + 's';
  flake.style.animationDelay = Math.random() * 5 + 's';

  snowContainer.appendChild(flake);

  setTimeout(() => {
    snowContainer.removeChild(flake);
  }, duration * 1000);
}
setInterval(createSnowflake, 200);


//ANIMATION //

function animateCards(sectionSelector) {
  const cards = document.querySelectorAll(sectionSelector);
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(15px)';
    card.style.animation = 'none';
    void card.offsetWidth; // reset animation
    card.style.animation = `slideFadeIn 0.4s ease forwards`;
    card.style.animationDelay = `${0.1 * (i+1)}s`;
  });
}

// Lors du changement d'onglet
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const pageId = btn.dataset.page;

    if(pageId === 'page-accueil') animateCards('.cards .card');
    if(pageId === 'page-qg') animateCards('.qg-cards .qg-card');
  });
});

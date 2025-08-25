/* ==============================
   MACARON STORE PWA - JS
   ============================== */

const whatsappNumber = "966536050535"; // Replace with your WhatsApp number
let currentLang = 'en';

const translations = {
  en: {
    storeName: "Macaron Store",
    tagline: "Delicious handmade macarons",
    profileEmail: "info@macaronstore.com",
    whatsappButton: "Send Selected Products on WhatsApp",
    totalLabel: "Total",
    products: [
      { id:1, name: "Vanilla Macaron", description:"Classic vanilla flavor", price:10, quantity:1 },
      { id:2, name: "Chocolate Macaron", description:"Rich dark chocolate", price:12, quantity:1 },
      { id:3, name: "Strawberry Macaron", description:"Fresh strawberry taste", price:11, quantity:1 }
    ]
  },
  ar: {
    storeName: "متجر الماكرون",
    tagline: "ماكرون يدوي لذيذ",
    profileEmail: "info@macaronstore.com",
    whatsappButton: "أرسل المنتجات المختارة على واتساب",
    totalLabel: "الإجمالي",
    products: [
      { id:1, name: "ماكرون فانيلا", description:"نكهة الفانيلا الكلاسيكية", price:10, quantity:1 },
      { id:2, name: "ماكرون شوكولاتة", description:"شوكولاتة داكنة غنية", price:12, quantity:1 },
      { id:3, name: "ماكرون فراولة", description:"نكهة الفراولة الطازجة", price:11, quantity:1 }
    ]
  }
};

let cart = [];

function renderProducts() {
  const t = translations[currentLang];
  document.getElementById("store-title").innerText = t.storeName;

  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";

  t.products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">🍰</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-description">${p.description}</div>
        <div class="product-price">$${p.price}</div>
        <div class="quantity-controls">
          <button class="qty-btn minus" data-index="${index}">-</button>
          <span class="qty">${p.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
          <button class="qty-btn add-to-cart" data-index="${index}">Add</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll(".qty-btn.plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      translations[currentLang].products[i].quantity++;
      renderProducts();
    });
  });
  document.querySelectorAll(".qty-btn.minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      if(translations[currentLang].products[i].quantity > 1){
        translations[currentLang].products[i].quantity--;
        renderProducts();
      }
    });
  });
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      addToCart(translations[currentLang].products[i]);
    });
  });
}

function addToCart(product){
  const exist = cart.find(p => p.id === product.id);
  if(exist){
    exist.quantity = product.quantity;
  } else {
    cart.push({...product});
  }
  updateCartBadge();
  renderCart();
}

function updateCartBadge(){
  document.getElementById("cart-badge").innerText = cart.length;
}

function renderCart(){
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((p, index) => {
    total += p.price * p.quantity;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-image">🍰</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">$${p.price}</div>
        <div class="quantity-controls">
          <button class="qty-btn minus" data-index="${index}">-</button>
          <span class="qty">${p.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>
      </div>
    `;
    cartItems.appendChild(div);
  });

  document.getElementById("total-amount").innerText = `${translations[currentLang].totalLabel}: $${total}`;

  document.querySelectorAll("#cart-items .qty-btn.plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      cart[i].quantity++;
      renderCart();
      renderProducts();
    });
  });
  document.querySelectorAll("#cart-items .qty-btn.minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.dataset.index;
      if(cart[i].quantity > 1){
        cart[i].quantity--;
        renderCart();
        renderProducts();
      }
    });
  });
}

document.getElementById("whatsapp-btn").addEventListener("click", () => {
  if(cart.length === 0){
    alert(currentLang==='en' ? "Cart is empty!" : "السلة فارغة!");
    return;
  }
  const messageLines = cart.map(p => `${p.name} - ${p.quantity} pcs - $${p.price * p.quantity}`);
  const message = (currentLang==='en' ? "Hello! I am interested in these products:\n" : "مرحباً! أنا مهتم بهذه المنتجات:\n") + messageLines.join("\n");
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

document.querySelectorAll("#language-switch button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    document.body.dir = currentLang==='ar'?'rtl':'ltr';
    renderProducts();
    renderCart();
  });
});

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(nav=>nav.classList.remove("active"));
    document.getElementById(item.dataset.page).classList.add("active");
    item.classList.add("active");
  });
});

renderProducts();
renderCart();

// Service Worker registration
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./service-worker.js')
    .then(reg=>console.log('Service Worker registered', reg))
    .catch(err=>console.log('Service Worker failed', err));
  });
}

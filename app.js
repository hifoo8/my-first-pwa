// ======== CONFIGURATION ======== //
const whatsappNumber = "966536050535";

const translations = {
  en: {
    shopName: "My Small Shop",
    shopTagline: "Your tagline goes here",
    contact: "info@myshop.com",
    whatsappButton: "Send Selected Products on WhatsApp",
    selectLabel: "Select",
    products: [
      { img: "product1.jpg", name: "Product 1", price: "$10" },
      { img: "product2.jpg", name: "Product 2", price: "$15" }
    ]
  },
  ar: {
    shopName: "متجري الصغير",
    shopTagline: "شعارك هنا",
    contact: "info@myshop.com",
    whatsappButton: "أرسل المنتجات المحددة على واتساب",
    selectLabel: "اختر",
    products: [
      { img: "product1.jpg", name: "المنتج 1", price: "$10" },
      { img: "product2.jpg", name: "المنتج 2", price: "$15" }
    ]
  }
};

let currentLang = 'en';
// ======== END CONFIGURATION ======== //

// Render content dynamically
function renderContent() {
  const t = translations[currentLang];

  // Header
  const header = document.getElementById("shop-header");
  header.innerHTML = `<h1>${t.shopName}</h1><p>${t.shopTagline}</p>`;

  // Products
  const container = document.getElementById("products");
  container.innerHTML = `<h2>${currentLang === 'en' ? 'Our Products' : 'منتجاتنا'}</h2>`;
  t.products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <p>${p.name} - ${p.price}</p>
      <label>
        <input type="checkbox" class="product-checkbox" data-index="${index}">
        ${t.selectLabel}
      </label>
    `;
    container.appendChild(div);
  });

  // WhatsApp Button
  document.getElementById("whatsapp-btn").innerText = t.whatsappButton;
}

// WhatsApp button click (send only selected products)
document.getElementById("whatsapp-btn").addEventListener("click", () => {
  const t = translations[currentLang];
  const checkboxes = document.querySelectorAll(".product-checkbox");
  const selectedProducts = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const index = cb.dataset.index;
      const p = t.products[index];
      selectedProducts.push(`${p.name} - ${p.price}`);
    }
  });

  if (selectedProducts.length === 0) {
    alert(currentLang === 'en' ? "Please select at least one product." : "يرجى اختيار منتج واحد على الأقل.");
    return;
  }

  const message = `${currentLang === 'en' ? 'Hello! I am interested in these products:' : 'مرحباً! أنا مهتم بهذه المنتجات:'}\n${selectedProducts.join("\n")}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// Language switch
document.querySelectorAll("#language-switch button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    renderContent();
  });
});

// Initial render
renderContent();

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

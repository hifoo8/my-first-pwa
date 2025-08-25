// ======== CONFIGURATION (EDIT ONLY THIS SECTION) ======== //

// Shop Info
const shopName = "My Small Shop";
const shopTagline = "Your tagline goes here";
const shopContact = "info@myshop.com";
const shopHeaderColor = "#4CAF50"; // header background color

// WhatsApp Number (include country code)
const whatsappNumber = "966536050535";

// Product List (image filename, name, price)
const products = [
  { img: "product1.jpg", name: "Product 1", price: "$10" },
  { img: "product2.jpg", name: "Product 2", price: "$15" },
  // Add more products here
];
// ======== END CONFIGURATION ======== //

// Insert header info dynamically
document.getElementById("shop-header").innerHTML = `
  <h1>${shopName}</h1>
  <p>${shopTagline}</p>
`;
document.getElementById("shop-header").style.backgroundColor = shopHeaderColor;

// Insert contact dynamically
document.getElementById("shop-contact").innerText = shopContact;

// Insert products dynamically
const productContainer = document.getElementById("products");
products.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <p>${p.name} - ${p.price}</p>
  `;
  productContainer.appendChild(div);
});

// WhatsApp Button Function
document.getElementById("whatsapp-btn").addEventListener("click", () => {
  const productList = products.map(p => `${p.name} - ${p.price}`).join("\n");
  const message = `Hello! I am interested in these products:\n${productList}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

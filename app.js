// ====== Editable Variables ====== //
// Replace your WhatsApp number here (country code + number)
const whatsappNumber = "966512345678"; 

// Add your product list here
const products = [
  "Product 1 - $10",
  "Product 2 - $15"
  // Add more products as needed
];
// ====== End Editable Variables ====== //

// Function to create WhatsApp URL with product list
function sendWhatsApp() {
  const message = "Hello! I am interested in these products:\n" + products.join("\n");
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank"); // Open WhatsApp link in new tab
}

// Register button click
document.getElementById("whatsapp-btn").addEventListener("click", sendWhatsApp);

// ====== Service Worker Registration for PWA ====== //
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

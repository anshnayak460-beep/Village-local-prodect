const WA_NUMBER = "918463017119";

const PRODUCTS = [
  {
    id: 1,
    name: "मिट्टी का घड़ा (15 लीटर)",
    category: "clay",
    price: 299,
    old: 399,
    emoji: "🏺",
    desc: "पारंपरिक मिट्टी का घड़ा"
  },
  {
    id: 2,
    name: "मिट्टी की सुराही",
    category: "clay",
    price: 249,
    old: 349,
    emoji: "🫖",
    desc: "घर के लिए देसी सुराही"
  },
  {
    id: 3,
    name: "मिट्टी के कुल्हड़ (6 पीस)",
    category: "clay",
    price: 149,
    old: 199,
    emoji: "🥤",
    desc: "चाय के लिए कुल्हड़ सेट"
  },
  {
    id: 4,
    name: "मिट्टी के दीये (12 पीस)",
    category: "clay",
    price: 199,
    old: 299,
    emoji: "🪔",
    desc: "पूजा और त्योहार के लिए"
  },
  {
    id: 5,
    name: "लकड़ी की चम्मच (5 पीस)",
    category: "wood",
    price: 99,
    old: 149,
    emoji: "🥄",
    desc: "रसोई के लिए लकड़ी की चम्मच"
  },
  {
    id: 6,
    name: "लकड़ी का हाथी शोपीस",
    category: "wood",
    price: 399,
    old: 599,
    emoji: "🐘",
    desc: "हस्तनिर्मित सजावट"
  },
  {
    id: 7,
    name: "लकड़ी का छोटा स्टूल",
    category: "wood",
    price: 599,
    old: 699,
    emoji: "🪑",
    desc: "घर के उपयोग के लिए"
  },
  {
    id: 8,
    name: "लकड़ी की सर्विंग ट्रे",
    category: "wood",
    price: 299,
    old: 359,
    emoji: "🪵",
    desc: "चाय और नाश्ता परोसने के लिए"
  }
];

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function getCart() {
  try {
    return JSON.parse(
      localStorage.getItem("vp-cart") || "{}"
    );
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(
    "vp-cart",
    JSON.stringify(cart)
  );

  updateCartCount();
  renderCart();
}

function addToCart(id) {
  const cart = getCart();

  cart[id] = (cart[id] || 0) + 1;

  saveCart(cart);

  alert("सामान कार्ट में जोड़ दिया गया।");
}

function changeQty(id, change) {
  const cart = getCart();

  cart[id] = (cart[id] || 0) + change;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();

  const count = Object.values(cart)
    .reduce((sum, quantity) => sum + quantity, 0);

  document.querySelectorAll("[data-cart-count]")
    .forEach(element => {
      element.textContent = count;
    });
}

function productCard(product) {
  return `
    <article class="card">

      <div class="photo">
        ${product.emoji}
      </div>

      <h3>${product.name}</h3>

      <p class="muted">
        ${product.desc}
      </p>

      <div class="muted">
        ★★★★★ लोकप्रिय
      </div>

      <div class="price">
        ${money(product.price)}
        <span class="old">
          ${money(product.old)}
        </span>
      </div>

      <button
        class="btn"
        onclick="addToCart(${product.id})"
      >
        🛒 कार्ट में जोड़ें
      </button>

    </article>
  `;
}

function renderProducts(
  target = "product-grid",
  category = "all",
  query = ""
) {
  const element = document.getElementById(target);

  if (!element) return;

  const searchText = query.toLowerCase().trim();

  const products = PRODUCTS.filter(product => {
    const categoryMatch =
      category === "all" ||
      product.category === category;

    const searchMatch =
      !searchText ||
      (
        product.name + " " + product.desc
      ).toLowerCase().includes(searchText);

    return categoryMatch && searchMatch;
  });

  element.innerHTML = products.length
    ? products.map(productCard).join("")
    : "<p>कोई प्रोडक्ट नहीं मिला।</p>";
}

function renderCart() {
  const element = document.getElementById("cart-list");

  if (!element) return;

  const cart = getCart();

  const items = Object.entries(cart)
    .filter(([id, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({
      product: PRODUCTS.find(p => p.id === Number(id)),
      quantity
    }))
    .filter(item => item.product);

  element.innerHTML = items.length
    ? items.map(item => `
        <div class="cartrow">

          <div>
            <b>
              ${item.product.emoji}
              ${item.product.name}
            </b>

            <div>
              ${money(item.product.price)}
              × ${item.quantity}
            </div>

            <div class="qty">

              <button
                onclick="changeQty(${item.product.id}, -1)"
              >−</button>

              ${item.quantity}

              <button
                onclick="changeQty(${item.product.id}, 1)"
              >+</button>

            </div>
          </div>

          <b>
            ${money(
              item.product.price * item.quantity
            )}
          </b>

        </div>
      `).join("")
    : "<p>आपका कार्ट खाली है।</p>";

  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const totalElement =
    document.getElementById("cart-total");

  if (totalElement) {
    totalElement.textContent = money(total);
  }

  updateCartCount();
}

function sendWhatsAppOrder() {
  const cart = getCart();

  const items = Object.entries(cart)
    .filter(([id, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({
      product: PRODUCTS.find(p => p.id === Number(id)),
      quantity
    }))
    .filter(item => item.product);

  if (!items.length) {
    alert("पहले कार्ट में सामान जोड़ें।");
    return;
  }

  const name = document
    .getElementById("customer-name")
    .value.trim();

  const phone = document
    .getElementById("customer-phone")
    .value.trim();

  const address = document
    .getElementById("customer-address")
    .value.trim();

  if (!name || !phone || !address) {
    alert("कृपया नाम, मोबाइल और पता भरें।");
    return;
  }

  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const productLines = items.map(item =>
    `• ${item.product.name} × ${item.quantity} = ${
      money(item.product.price * item.quantity)
    }`
  ).join("\n");

  const message =
`नमस्ते Village Product!

मेरा ऑर्डर:

${productLines}

कुल कीमत: ${money(total)}

नाम: ${name}
मोबाइल: ${phone}
पता: ${address}

कृपया उपलब्धता और डिलीवरी की पुष्टि करें।`;

  const url =
    "https://wa.me/" +
    WA_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  const search = document.getElementById("search");

  if (search) {
    search.addEventListener("input", () => {
      renderProducts(
        "product-grid",
        "all",
        search.value
      );
    });
  }

  document.querySelectorAll(
    "[data-product-category]"
  ).forEach(button => {
    button.addEventListener("click", () => {
      renderProducts(
        "product-grid",
        button.dataset.productCategory
      );
    });
  });

  const orderButton =
    document.getElementById("send-order");

  if (orderButton) {
    orderButton.addEventListener(
      "click",
      sendWhatsAppOrder
    );
  }
});

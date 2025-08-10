const cardsEl = document.querySelector(".cards");
const srcInputEl = document.querySelector("#search");
const modalContentEl = document.querySelector("#modalContent");
const productModalEl = document.querySelector("#productModal");
const cartPanelEl = document.querySelector("#cartPanel");
const basketInnerEl = document.querySelector("#basket-inner");
const basketCountEl = document.querySelector("#basket-count");
const basketCountEl2 = document.querySelector("#basket-count2");
const totalPriceEl = document.querySelector("#total-price");

let products = [];
let basket = [];

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    show(products);
  });

function show(arr) {
  let html = "";

  arr
    .filter((item) =>
      item.title.toLowerCase().startsWith(srcInputEl.value.trim().toLowerCase())
    )
    .forEach((item) => {
      html += `
        <div onclick="openModal(${item.id})" class="card cursor-pointer w-[300px] border border-gray-300 bg-white shadow-md rounded-2xl overflow-hidden hover:scale-[1.03] transition transform duration-300 flex flex-col">
          <img src="${item.image}" alt="${item.title}" class="w-full h-56 object-contain p-4">
          <div class="flex flex-col justify-between flex-grow p-4">
            <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-1 line-clamp-2">${item.title}</h3>
            <p class="text-gray-500 text-sm mb-3 line-clamp-3">${item.description}</p>
            <div class="mt-auto">
              <div class="flex justify-between items-center mb-2">
                <span class="text-green-600 font-bold text-lg">$${item.price}</span>
                <span class="text-yellow-500 text-sm">⭐ ${item.rating.rate} <span class="text-gray-500">(${item.rating.count})</span></span>
              </div>
              <p class="text-xs text-gray-400 italic">Kategoriya: ${item.category}</p>
              <button class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition" onclick="add(event, ${item.id})">Add to Basket</button>
            </div>
          </div>
        </div>`;
    });

  cardsEl.innerHTML = html;
}

function serc() {
  show(products);
}

function openModal(id) {
  let item = products.find((item) => item.id == id);

  modalContentEl.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${item.title}</h2>
    <img src="${item.image}" class="w-48 h-48 mx-auto object-contain mb-4" />
    <p class="mb-2 text-sm text-gray-300">${item.description}</p>
    <p class="text-green-400 font-semibold mb-1">Price: $${item.price}</p>
    <p class="text-yellow-400 mb-1">Rating: ⭐ ${item.rating.rate} (${item.rating.count} rəy)</p>
    <p class="text-gray-400">Kategoriya: ${item.category}</p>
    <button 
      class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      onclick="add(event, ${item.id})">
      Add to Basket
    </button>
  `;

  productModalEl.classList.remove("hidden");
}

function closeModal() {
  productModalEl.classList.add("hidden");
}

function toggleCart() {
  cartPanelEl.classList.toggle("translate-x-full");
}

function closeCart() {
  cartPanelEl.classList.add("translate-x-full");
}

function add(e, id) {
  e.stopPropagation();
  const control = basket.some((item) => item.id == id);
  if (!control) {
    const findEl = products.find((item) => item.id == id);
    basket.push({ ...findEl, quantity: 1 });
  } else {
    basket = basket.map((item) =>
      item.id == id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  showBasket();
}

function showBasket() {
  let html = "";
  let count = 0;
  let total = 0;

  basket.forEach((item) => {
    html += `
    <div class="flex items-center justify-between border-b border-gray-300 py-4 px-3 hover:bg-gray-50 rounded-lg transition">
      <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-contain rounded-lg shadow-sm mr-4" />
      <div class="flex-1 min-w-0">
        <h4 class="text-gray-900 font-semibold text-base truncate">${item.title}</h4>
        <p class="text-gray-600 text-sm mt-1">Price: $${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="changeQuantity(false, ${item.id})" 
          class="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg font-bold select-none transition">
          − 
        </button>
        <span class="w-8 text-center font-medium text-gray-700">${item.quantity}</span>
        <button onclick="changeQuantity(true, ${item.id})" 
          class="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg font-bold select-none transition">
          +
        </button>
      </div>
      <div class="flex flex-col items-end ml-4 min-w-[75px]">
        <p class="text-green-600 font-bold text-lg mb-2">$${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="dell(${item.id})" 
          class="text-red-600 hover:text-red-800 text-sm font-semibold">
          Delete
        </button>
      </div>
    </div>
  `;
    count += item.quantity;
    total += item.price * item.quantity;
  });

  basketInnerEl.innerHTML = html;
  basketCountEl.innerHTML = count;
  basketCountEl2.innerHTML = count;
  totalPriceEl.innerHTML = `Total: $${total.toFixed(2)}`;
}

showBasket();

function dell(id) {
  basket = basket.filter((item) => item.id !== id);
  showBasket();
}

function changeQuantity(boolean, id) {
    const findEl = basket.find(item => item.id == id)
    if (boolean) findEl.quantity += 1
    else findEl.quantity > 1 ? findEl.quantity -= 1 : dell(id)

  showBasket()
}
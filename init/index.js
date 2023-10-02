const fs = require("fs");
const path = require("path");

const products = require("./data/products.json");
const categories = require("./data/categories.json");

/** имплементация категорий в продукты */
products.forEach((product) => {
  product.category = categories.find(
    (category) => category.name === product.category
  );
});

/** добавление скидки в продукты */
products.forEach((product) => {
  const discountExists = Math.random() > 0.66;
  const discount = discountExists ? (Math.random() * 0.3).toFixed(2) : 0;
  product.discount = discount;
});

/** добавление истории цены и скидки */
function generateDate(days) {
  const date = new Date();
  const pastDate = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  return pastDate;
}

products.forEach((products) => {
  products.priceHistory = [];
  let lastPrice = products.price;
  let lastDiscount = products.discount;

  for (let i = 1; i < 30; i++) {
    const changePrice = Math.random() > 0.9;
    const price = changePrice
      ? Math.round(lastPrice * (0.95 + Math.random() * 0.1))
      : lastPrice;
    const discountExists = Math.random() > 0.9;
    const discount = discountExists
      ? (Math.random() * 0.3).toFixed(2)
      : lastDiscount; // 0 - 0.3
    const date = generateDate(i);
    products.priceHistory.push({ price, discount, date });
    lastPrice = price;
    lastDiscount = discount;
  }

  for (let i = 1; i < 12; i++) {
    const changePrice = Math.random() > 0.5;
    const price = changePrice
      ? Math.round(lastPrice * (0.9 + Math.random() * 0.2))
      : lastPrice;
    const discountExists = Math.random() > 0.66;
    const discount = discountExists ? (Math.random() * 0.3).toFixed(2) : 0; // 0 - 0.3
    const date = generateDate(i * 30);
    products.priceHistory.push({ price, discount, date });
    lastPrice = price;
  }

  for (let i = 1; i < 5; i++) {
    const changePrice = Math.random() > 0.1;
    const price = changePrice
      ? Math.round(lastPrice * (0.8 + Math.random() * 0.4))
      : lastPrice;
    const discountExists = Math.random() > 0.66;
    const discount = discountExists ? (Math.random() * 0.3).toFixed(2) : 0; // 0 - 0.3
    const date = generateDate(i * 365);
    products.priceHistory.push({ price, discount, date });
    lastPrice = price;
  }
});

/** Сохранение */
const newProducts = JSON.stringify(products, null, 2);
const newCategories = JSON.stringify(categories, null, 2);

fs.writeFileSync(
  path.join(__dirname, "..", "app", "data", "products.json"),
  newProducts,
  { flag: "wx" }
);
fs.writeFileSync(
  path.join(__dirname, "..", "app", "data", "categories.json"),
  newCategories,
  { flag: "wx" }
);

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan("tiny"));
app.use(cors());

const productsData = require("./data/products.json");
const categoriesData = require("./data/categories.json");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/products", (req, res) => {
  const {
    offset = 0,
    limit = productsData.length,
    include = "",
    substring = "",
    max,
    min,
    sort,
  } = req.query;

  const filteredProducts = productsData.filter((product) => {
    if (
      (include.length > 0 &&
        !include.split("|").includes(String(product.category.id))) ||
      (substring.length > 0 &&
        !product.title.toLowerCase().includes(substring.toLowerCase()) &&
        !product.subtitle.toLowerCase().includes(substring.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  if (sort === "price") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "-price") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "title") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "-title") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }

  const maxPrice = Math.max(...filteredProducts.map((p) => p.price));
  const minPrice = Math.min(...filteredProducts.map((p) => p.price));

  const minMaxProducts = filteredProducts.filter(
    (product) =>
      (!max || product.price <= +max) && (!min || product.price >= +min)
  );

  const total = minMaxProducts.length;

  res.set({
    "Access-Control-Expose-Headers": "X-Total-Count, X-Max-Price, X-Min-Price",
    "X-Total-Count": total,
    "X-Max-Price": maxPrice,
    "X-Min-Price": minPrice,
  });

  const products = minMaxProducts.slice(+offset, +offset + +limit);

  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = productsData.find((product) => product.id === +req.params.id);
  res.json(product);
});

app.get("/api/categories", (req, res) => {
  res.json(categoriesData);
});

app.listen(9000, () => {
  console.log("Server started on port 9000");
});

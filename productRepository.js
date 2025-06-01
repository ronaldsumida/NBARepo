const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

class ProductRepository {
  constructor() {
    this.products = this._readProducts();
  }

  _readProducts() {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  _writeProducts() {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  getAll() {
    return this.products;
  }

  get(id) {
    return this.products.find(p => p.ProductID === id);
  }

  add(product) {
    // Generate new ProductID
    const maxId = this.products.reduce((max, p) => Math.max(max, p.ProductID), 0);
    product.ProductID = maxId + 1;
    this.products.push(product);
    this._writeProducts();
    return product;
  }

  update(id, updatedProduct) {
    const index = this.products.findIndex(p => p.ProductID === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updatedProduct, ProductID: id };
    this._writeProducts();
    return this.products[index];
  }

  delete(id) {
    const index = this.products.findIndex(p => p.ProductID === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    this._writeProducts();
    return true;
  }
}

module.exports = ProductRepository;
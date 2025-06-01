// express server setup
const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Add /champions endpoint to serve champions.html
app.get('/champions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'champions.html'));
});

// Serve the index.html file for all routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ...existing code...
const ProductRepository = require('./productRepository');
const productRepo = new ProductRepository();

// ...existing code...

// CRUD API for products

// Get all products
app.get('/api/products', (req, res) => {
  res.json(productRepo.getAll());
});

// Get a product by ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = productRepo.get(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Add a new product
app.post('/api/products', (req, res) => {
  const { ProductName, UnitPrice } = req.body;
  if (!ProductName || typeof UnitPrice !== 'number') {
    return res.status(400).json({ error: 'Invalid product data' });
  }
  const newProduct = productRepo.add({ ProductName, UnitPrice });
  res.status(201).json(newProduct);
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { ProductName, UnitPrice } = req.body;
  const updated = productRepo.update(id, { ProductName, UnitPrice });
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = productRepo.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(204).send();
});

// ...existing code...

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
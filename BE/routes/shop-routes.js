const express = require('express');
const router = express.Router();
const { ItemProductCreate, ItemProductDelete, ItemProductUpdate } = require('../model/shop-model');
const { productValidationCreateSchema, productValidationDeleteSchema, productValidationUpdateSchema } = require('../validation/shop');

// Endpoint pro získání všech položek
router.get('/getAllProducts', async (req, res) => {
    try {
        const shop = await ItemProductCreate.find({}).sort({ name: 1 });
        res.json(shop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/createProduct', async (req, res) => {
    try {
        const { _id, name, description, price } = req.body;

        const { error } = productValidationCreateSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }

        // Kontrola existence produktu se stejným názvem
        const existingProduct = await ItemProductCreate.findOne({ name });

        if (existingProduct) {
            return res.status(400).json({ error: 'Produkt se stejným názvem již existuje.' });
        }

        if (price < 0) {
            return res.status(400).json({ error: 'Cena nemůže být záporná hodnota.' });
        }

        // Validace vstupních dat podle modelu
        const newProduct = new ItemProductCreate({
            _id,
            name,
            description,
            price,
        });

        const savedProduct = await newProduct.save();

        res.json(savedProduct);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};

            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ error: 'Chyba při vytváření produktu', errors });
        }

        console.error('Chyba při vytváření produktu:', error);
        res.status(500).json({ error: 'Chyba při vytváření produktu' });
    }
});

// Endpoint pro aktualizaci produktu
router.put('/updateProduct', async (req, res) => {
    try {
        const productId = req.body._id;
        const updatedProductData = req.body;

        const { error } = productValidationUpdateSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }

        const existingProduct = await ItemProductCreate.findOne({ name: req.body.name });

        if (existingProduct && existingProduct._id.toString() !== productId) {
            return res.status(400).json({ error: 'Produkt se stejným názvem již existuje.' });
        }

        if (req.body.price < 0) {
            return res.status(400).json({ error: 'Cena nemůže být záporná hodnota.' });
        }

        // Aktualizace produktu
        const updatedProduct = await ItemProductUpdate.findByIdAndUpdate(productId, updatedProductData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: `Produkt s id ${productId} nebyl nalezen.` });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Chyba při aktualizaci produktu:', error);
        res.status(500).json({ error: 'Chyba při aktualizaci produktu' });
    }
});

router.delete('/deleteProduct', async (req, res) => {
    try {
        const { error, value } = productValidationDeleteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }

        const productId = value._id;

        // Kontrola existence produktu se stejným názvem
        const deletedProduct = await ItemProductDelete.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(400).json({ error: `Produkt s id ${productId} neexistuje.` });
        }

        res.json({ message: 'Produkt byl úspěšně smazán.' });
    } catch (error) {
        console.error('Chyba při vytváření produktu:', error);
        res.status(500).json({ error: 'Chyba při mazání produktu' });
    }
});

module.exports = router;

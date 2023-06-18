const express = require('express');
const router = express.Router();
const { ItemCategoryCreate, ItemCategoryUpdate, ItemCategoryDelete } = require('../model/category-model');
const { categoryValidationCreateSchema, categoryValidationUpdateSchema, categoryValidationDeleteSchema } = require('../validation/category');

// Endpoint pro získání všech položek
router.get('/getAllCategory', async (req, res) => {
    try {
        const category = await ItemCategoryCreate.find({});
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/createCategory', async (req, res) => {
    try {
        const { _id, name, active } = req.body;

        const { error } = categoryValidationCreateSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }

        // Kontrola existence kategorie se stejným názvem
        const existingCategory = await ItemCategoryCreate.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ error: 'Kategorie se stejným názvem již existuje.' });
        }

        // Validace vstupních dat podle modelu
        const newcategory = new ItemCategoryCreate({
            _id,
            name,
            active,
        });

        const savedCategory = await newcategory.save();

        res.json(savedCategory);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};

            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }

            return res.status(400).json({ error: 'Chyba při vytváření kategorie', errors });
        }

        console.error('Chyba při vytváření kategorie:', error);
        res.status(500).json({ error: 'Chyba při vytváření kategorie.' });
    }
});

router.put('/updateCategory', async (req, res) => {
    try {
        const categoryId = req.body._id;
        const updatedCategoryData = req.body;

        const { error } = categoryValidationUpdateSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }

        const existingCategory = await ItemCategoryUpdate.findOne({ name: req.body.name });

        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            return res.status(400).json({ error: 'Kategorie se stejným názvem již existuje.' });
        }

        // Aktualizace kategorie
        const updatedCategory = await ItemCategoryUpdate.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: `Kategorie s id ${categoryId} nebyl nalezen.` });
        }

        res.json(updatedCategory);
    } catch (error) {
        console.error('Chyba při aktualizaci kategorie:', error);
        res.status(500).json({ error: 'Chyba při aktualizaci kategorie' });
    }
});

router.delete('/deleteCategory', async (req, res) => {
    try {
        const { error, value } = categoryValidationDeleteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ errors });
        }

        const categoryId = value._id;

        // Kontrola existence produktu se stejným názvem
        const deletedProduct = await ItemCategoryDelete.findByIdAndDelete(categoryId);

        if (!deletedProduct) {
            return res.status(400).json({ error: `Kategorie s id ${categoryId} neexistuje.` });
        }

        res.json({ message: 'Kategorie byla úspěšně smazána.' });
    } catch (error) {
        console.error('Chyba při mazání kategorie:', error);
        res.status(500).json({ error: 'Chyba při mazání kategorie' });
    }
});

module.exports = router;

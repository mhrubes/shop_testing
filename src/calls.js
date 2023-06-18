import axios from 'axios';
const API_BASE_URL = 'http://localhost:3001'; // Zde je nutné zadat správnou URL pro API server

// shop API
const getAllShopProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shop/getAllProducts`);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při načítání produktů');
    }
};

const createShopProduct = async (product) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/shop/createProduct`, product);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při vytváření produktu');
    }
};

const updateShopProduct = async (product) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/shop/updateProduct`, product);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při aktualizaci produktu', error);
    }
};

const deleteShopProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/shop/deleteProduct`, { data: { _id: productId } });
        return response.data;
    } catch (error) {
        throw new Error('Chyba při mazání produktu', error);
    }
};

// category API
const getAllCategory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/category/getAllCategory`);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při načítání kategorií');
    }
};

const createCategory = async (category) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/category/createCategory`, category);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při vytváření kategorie');
    }
};

const updateCategory = async (category) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/category/updateCategory`, category);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při aktualizaci kategorie', error);
    }
};

const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/category/deleteCategory`, { data: { _id: categoryId } });
        return response.data;
    } catch (error) {
        throw new Error('Chyba při mazání kategorie', error);
    }
};

// users API
const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/getAllUsers`);
        return response.data;
    } catch (error) {
        throw new Error('Chyba při načítání uživatelů', error);
    }
};

export {
    getAllShopProducts, createShopProduct, updateShopProduct, deleteShopProduct,
    getAllCategory, createCategory, updateCategory, deleteCategory,
    getAllUsers
};
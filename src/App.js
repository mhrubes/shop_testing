// import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProductProvider } from './contexts/AppContext';
import Login from './login';
import Main from './product/Main';
import ShoppingCart from './product/ShoppingCart'
import ProductDetail from './product/ProductDetail';
// import { getProductsFromMongoDB } from './api'; // Funkce pro načítání dat z MongoDB
// import './db'; // Import připojení k MongoDB

const App = () => {
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   // Načtení dat z MongoDB a aktualizace stavu products
  //   const fetchData = async () => {
  //     try {
  //       const data = await getProductsFromMongoDB();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error('Chyba při načítání dat z MongoDB:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <ProductProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/shoppingcart" element={<ShoppingCart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </ProductProvider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { getAllShopProducts, createShopProduct, getAllUsers, deleteShopProduct, updateShopProduct } from '../calls'; 

import { rolesList } from '../data';

const AppContext = React.createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setRole] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllShopProducts();
        setProducts(data);

        const dataUser = await getAllUsers();
        setUsers(dataUser);
      } catch (error) {
        console.error('Chyba při načítání dat z MongoDB:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateShoppingCart = () => {
      const updatedCart = shoppingCart.map((item) => {
        const updatedProduct = products.find((product) => product._id === item._id);
        return updatedProduct ? { ...updatedProduct, count: item.count } : item;
      });
      setShoppingCart(updatedCart);
    };

    updateShoppingCart();
  }, [products]);

  // Funkce pro přihlášení
  const handleLogin = (user) => {
    let minKey = Infinity;
    let minValue;

    user.role.forEach(role => {
      const roleKey = Array.from(rolesList.values()).indexOf(role) + 1;
      if (roleKey < minKey) {
        minKey = roleKey;
        minValue = role;
      }
    });

    setRole(minValue);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Funkce pro manipulaci s daty
  const addProduct = async (product) => {
    try {
      let uniqueId = uuidv4();
      product._id = uniqueId;

      while (products.some((p) => p.id === uniqueId)) {
        uniqueId = uuidv4();
        product._id = uniqueId;
      }

      const data = await createShopProduct(product);

      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, product];
        return updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      const updatedProducts = products.filter((product) => product._id !== productId);
      setProducts(updatedProducts);

      const indexCart = shoppingCart.findIndex((item) => item._id === productId);
      if (indexCart !== -1) {
        shoppingCart.splice(indexCart, 1);
        setShoppingCart([...shoppingCart]);
      }

      const data = await deleteShopProduct(productId);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const updateProduct = async (updatedProductData) => {
    try {
      const data = await updateShopProduct(updatedProductData);

      setProducts((prevProducts) => {
        return prevProducts.map((product) =>
          product._id === updatedProductData._id ? updatedProductData : product
        );
      });

      setShoppingCart((prevCart) => {
        return prevCart.map((item) =>
          item._id === updatedProductData._id ? { ...updatedProductData, count: item.count } : item
        );
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const addToShoppingCart = (productId) => {
    const product = products.find((p) => p._id === productId);

    if (product) {
      const existingItem = shoppingCart.find((item) => item._id === productId);

      if (existingItem) {
        setShoppingCart((prevCart) =>
          prevCart.map((item) =>
            item._id === productId ? { ...item, count: item.count + 1 } : item
          )
        );
      } else {
        setShoppingCart((prevCart) => [...prevCart, { ...product, count: 1 }]);
      }
    }
  };

  const emptyShoppingCart = () => {
    setShoppingCart([]);
  }

  const updateShoppingCartItem = (itemId, operation) => {
    const existingItem = shoppingCart.find((item) => item._id === itemId);
    if (existingItem) {
      if (operation) {
        setShoppingCart((prevCart) =>
          prevCart.map((item) =>
            item._id === itemId ? { ...item, count: item.count + 1 } : item
          )
        );
      }
      else {
        setShoppingCart((prevCart) =>
          prevCart.map((item) =>
            item._id === itemId && item.count > 1 ? { ...item, count: item.count - 1 } : item
          )
        );
      }

    }
  }

  const deleteShoppingCartItem = (itemId) => {
    const updatedProducts = shoppingCart.filter((item) => item._id !== itemId);
    setShoppingCart(updatedProducts);
  }

  // Hodnota kontextu
  const contextValue = {
    products,
    users,
    addProduct, removeProduct, updateProduct,
    isLoggedIn, handleLogin, handleLogout,
    userRole, setRole,
    shoppingCart, setShoppingCart, addToShoppingCart, emptyShoppingCart, updateShoppingCartItem, deleteShoppingCartItem
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext, ProductProvider };
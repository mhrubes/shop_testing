import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllShopProducts, createShopProduct, deleteShopProduct, updateShopProduct,
  getAllCategory, createCategory, updateCategory, deleteCategory,
  getAllUsers
} from '../calls';

import { rolesList } from '../data';

const AppContext = React.createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setRole] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataUser = await getAllUsers();
        setUsers(dataUser);

        const dataProduct = await getAllShopProducts();
        setProducts(dataProduct);

        const dataCategory = await getAllCategory();
        setCategories(dataCategory);

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

  const addToShoppingCart = async (productId) => {
    try {
      const product = products.find((p) => p._id === productId);

      if (product && product.stock > 0) {
        const existingItem = shoppingCart.find((item) => item._id === productId);

        const updatedProducts = products.map((p) =>
          p._id === productId ? { ...p, stock: p.stock - 1 } : p
        );
        setProducts(updatedProducts);

        const updatedSelectedProduct = updatedProducts.find(item => item._id === productId);
        const data = await updateShopProduct(updatedSelectedProduct);

        if (existingItem) {
          setShoppingCart((prevCart) =>
            prevCart.map((item) =>
              item._id === productId ? { ...item, count: item.count + 1 } : item
            )
          );
        } else {
          setShoppingCart((prevCart) => [...prevCart, { ...product, count: 1 }]);
        }

        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateShoppingCartItem = async (itemId, operation) => {
    try {
      const existingItem = shoppingCart.find((item) => item._id === itemId);
      if (existingItem) {
        if (operation && existingItem.stock > 0) {
          const updatedProducts = products.map((p) =>
            p._id === itemId ? { ...p, stock: p.stock - 1 } : p
          );
          setProducts(updatedProducts);

          const updatedSelectedProduct = updatedProducts.find(item => item._id === itemId);
          const data = await updateShopProduct(updatedSelectedProduct);

          setShoppingCart((prevCart) =>
            prevCart.map((item) =>
              item._id === itemId ? { ...item, count: item.count + 1 } : item
            )
          );

          return data;
        }
        else {
          const productInCart = shoppingCart.map((item) =>
            item._id === itemId ? item : item
          )

          let data;
          if (productInCart[0].count > 0) {
            const updatedProducts = products.map((p) =>
              p._id === itemId ? { ...p, stock: p.stock + 1 } : p
            );
            setProducts(updatedProducts);

            const updatedSelectedProduct = updatedProducts.find(item => item._id === itemId);

            data = await updateShopProduct(updatedSelectedProduct);
          }

          setShoppingCart((prevCart) =>
            prevCart.map((item) =>
              item._id === itemId && item.count > 0 ? { ...item, count: item.count - 1 } : item
            )
          );

          return data;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteShoppingCartItem = async (itemId, item) => {
    try {
      const updatedProducts = products.map((p) =>
        p._id === itemId ? { ...p, stock: p.stock + item.count } : p
      );
      setProducts(updatedProducts);

      const updatedSelectedProduct = updatedProducts.find(item => item._id === itemId);
      const data = await updateShopProduct(updatedSelectedProduct);

      const updatedCartProducts = shoppingCart.filter((item) => item._id !== itemId);
      setShoppingCart(updatedCartProducts);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const emptyShoppingCart = async () => {
    let updatedStocks = [];

    const updateProductAsync = async (itemId) => {
      const updatedSelectedProduct = updatedStocks.find((item) => item._id === itemId);
      const data = await updateShopProduct(updatedSelectedProduct);
      return data;
    };

    updatedStocks = shoppingCart.map((item) => {
      const product = products.find((p) => p._id === item._id);
      if (product) {
        return { ...product, stock: product.stock + item.count };
      }
      return null;
    }).filter(Boolean);

    setIsLoading(true);
    setProducts(updatedStocks);

    for (const item of updatedStocks) {
      await updateProductAsync(item._id);
    }

    setShoppingCart([]);
    setIsLoading(false);
  };

  // Hodnota kontextu
  const contextValue = {
    products,
    categories,
    users,
    isLoading,
    addProduct, removeProduct, updateProduct,
    isLoggedIn, handleLogin, handleLogout,
    userRole, setRole,
    shoppingCart, setShoppingCart, addToShoppingCart, emptyShoppingCart, updateShoppingCartItem, deleteShoppingCartItem
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext, ProductProvider };
// src/itemDetail.js
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';

const ShoppingCart = () => {
  const { products, shoppingCart, isLoggedIn, setShoppingCart, emptyShoppingCart, updateShoppingCartItem, deleteShoppingCartItem } = useContext(AppContext);
  const navigate = useNavigate();
  const [shoppingCartItems, setShoppingCartItems] = useState(shoppingCart);
  const [shoppingCartItemCount, setShoppingCartItemCount] = useState(0);
  const [shoppingCartItemsPrice, setShoppingCartItemsPrice] = useState(0);

  useEffect(() => {
    let counter = 0;
    let countPrice = 0;
    shoppingCart.forEach(item => {
      counter += item.count;
      countPrice += (item.price * item.count);
    });
    setShoppingCartItemCount(counter);
    setShoppingCartItemsPrice(countPrice);

    setShoppingCartItems(shoppingCart);
  }, [shoppingCart, products]);

  useEffect(() => {
    if (isLoggedIn !== true) {
      navigate('/');
    }

    if (shoppingCartItems.length === 0) {
      navigate('/Main');
    }

    return () => { }
  });

  useEffect(() => {
    const updateShoppingCart = () => {
      const updatedShoppingCart = shoppingCart.filter(item => products.some(product => product._id === item._id));
      setShoppingCart(updatedShoppingCart);
      setShoppingCartItems(updatedShoppingCart);
    };

    const delay = setTimeout(updateShoppingCart, 500);

    return () => clearTimeout(delay);
  }, [products, shoppingCart]);

  const handleUpdateShoppingCartItem = (itemId, operation, count, stock) => {
    if (operation && stock > 0)
      updateShoppingCartItem(itemId, operation);
    else if (!operation && count >= 0)
      updateShoppingCartItem(itemId, operation);
  }

  const handleDeleteShoppingCartItem = (itemId, item) => {
    deleteShoppingCartItem(itemId, item);
  }

  const handleEmptyShoppingCart = () => {
    emptyShoppingCart();
  }

  return isLoggedIn && (
    <div className='container text-center'>
      <h1>Nákupní košík <strong> {shoppingCartItemCount} </strong> </h1>
      <button className='btn btn-outline-primary' onClick={() => navigate(-1)}>Zpět</button>
      <hr />

      {shoppingCartItemCount !== 0 &&
        <div style={{ textAlign: 'right' }}>
          <button className='btn btn-outline-warning' onClick={() => handleEmptyShoppingCart()}>
            Vysypat košík
          </button>
        </div>}

      <div className="row m-0 mt-1">
        {shoppingCartItems !== [] && shoppingCartItems.map((item) => (
          <div key={item._id} className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <div style={{ textAlign: 'right' }}>
                  <button className='btn' onClick={() => handleDeleteShoppingCartItem(item._id, item)}>
                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: "20px" }} />
                  </button>
                </div>

                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Cena: {item.price}</p>
                <p className="card-text">Kusů na skladě: {item.stock}</p>
                <hr />
                <p className="card-title">V košíku: {item.count}</p>
                <p className="card-text">Celková Cena: {item.price * item.count}</p>

                <button className={`btn btn-outline-danger m-1 ${item.count === 0 ? "disabled" : "enabled"}`} onClick={() => handleUpdateShoppingCartItem(item._id, false, item.count, item.stock)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>

                <button className={`btn btn-outline-success m-1 ${item.stock > 0 ? "enabled" : "disabled"}`} onClick={() => handleUpdateShoppingCartItem(item._id, true, item.count, item.stock)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shoppingCartItems.length > 0 && <div>
        <hr />
        <table className='table mt-3'>
          <thead>
            <tr>
              <th scope="col">Název produktu</th>
              <th scope="col">V košíku</th>
              <th scope="col">Cena/ks</th>
              <th scope="col">Součet</th>
            </tr>
          </thead>
          <tbody>
            {shoppingCartItems !== [] && shoppingCartItems.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.count}</td>
                <td>{item.price}</td>
                <td>{item.price * item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {shoppingCartItems.length > 0 &&
        <div className="row m-0 mb-5">
          <hr />
          <div className="col-md-6"></div>
          <div className="col-md-6" style={{ fontSize: "17px", textAlign: "right" }}>
            <p>
              Celkový počet všech kusů: <strong>{shoppingCartItemCount}</strong>
            </p>
            <p>
              Celková cena všech kusů: <strong>{shoppingCartItemsPrice}</strong>
            </p>
          </div>
        </div>}

      {shoppingCartItems.length === 0 &&
        <h3>Váš košík je prázdný</h3>
      }

    </div >
  );
};

export default ShoppingCart;

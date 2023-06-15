// src/ProductDetail.js
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
// import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { selectedProduct, isLoggedIn } = useContext(AppContext);
  // const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoggedIn !== true) {
      navigate('/');
    }
    return () => { }
  });

  return isLoggedIn && (
    <div className='container text-center'>
      <h1>Produkt Detail</h1>
      <button className='btn btn-outline-primary' onClick={() => navigate(-1)}>Zpět</button>

      <hr />
      {selectedProduct && (
        <div>
          <h2>{selectedProduct.name}</h2>
          <h3>cena: {selectedProduct.price}</h3>
          <p>{selectedProduct.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

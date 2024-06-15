import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, storage } from '../../Firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { FaTrash } from 'react-icons/fa';
import { FaPaypal } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';

function Maincartpage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email);
      } else {
        setUser(null);
        setUserEmail('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchItemsFromCart = async () => {
      try {
        if (userEmail) {
          const itemsCollection = collection(db, `cart/${userEmail}/items`);
          const itemsSnapshot = await getDocs(itemsCollection);
          const itemsList = itemsSnapshot.docs.map(doc => doc.data());
          setCartItems(itemsList);

          const cartItemsIdArray = itemsList.map(item => item.itemId);
          const storageRef = ref(storage, 'laptop-images');
          const rootResult = await listAll(storageRef);

          const newImageUrls = [];
          for (const prefixRef of rootResult.prefixes) {
            const emailContents = await listAll(prefixRef);
            for (let item of emailContents.items) {
              const index = cartItemsIdArray.indexOf(item.name);
              if (index !== -1 && newImageUrls.length < cartItemsIdArray.length) {
                try {
                  const downloadUrl = await getDownloadURL(item);
                  newImageUrls.push(downloadUrl);
                } catch (error) {
                  console.error('Error fetching image URL:', error);
                }
                if (newImageUrls.length === cartItemsIdArray.length) {
                  break;
                }
              }
            }
            if (newImageUrls.length === cartItemsIdArray.length) {
              break;
            }
          }
          setImageUrls(newImageUrls);

          const initialQuantities = {};
          let initialTotalItems = 0;
          itemsList.forEach(item => {
            initialQuantities[item.itemId] = item.quantity || 1;
            initialTotalItems += item.quantity || 1;
          });
          setQuantities(initialQuantities);
          setTotalItems(initialTotalItems);

          // Calculate initial total price
          let initialTotalPrice = 0;
          itemsList.forEach(item => {
            initialTotalPrice += parsePrice(item.item_price) * (item.quantity || 1);
          });
          setTotalPrice(initialTotalPrice);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    if (userEmail) {
      fetchItemsFromCart();
    }
  }, [userEmail]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prevQuantities => {
      const newQuantities = { ...prevQuantities, [itemId]: value };
      updateTotalPriceAndItems(newQuantities);
      return newQuantities;
    });
  };

  const updateTotalPriceAndItems = (newQuantities) => {
    let newTotalPrice = 0;
    let newTotalItems = 0;
    cartItems.forEach(item => {
      const quantity = newQuantities[item.itemId] || 1;
      newTotalPrice += parsePrice(item.item_price) * quantity;
      newTotalItems += quantity;
    });
    setTotalPrice(newTotalPrice);
    setTotalItems(newTotalItems);
  };

  const parsePrice = (price) => {
    return parseFloat(price.replace(/,/g, ''));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='cart-main-page-wrapper'>
      <h4 className='cart-heading'>Cart</h4>
      <div className='items-main-section'>
        <div className="cart-subtitles">
          <h4>Laptops</h4>
          <h4>Quantity</h4>
          <h4>Total Price</h4>
        </div>
        
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={item.itemId} className='item-main-section'>
              <div className='item-image' style={{ backgroundImage: `url(${imageUrls[index] || 'placeholder.jpg'})` }}>
                <div title='Remove from cart'><FaTrash className='cart-delete-icon' title="delete icon"/></div>
              </div>
              <div className="item-name">{item.item_name}</div>
              <div className="item-quantity">
                <input
                  type="number"
                  value={quantities[item.itemId] || 1}
                  onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value))}
                />
              </div>
              <div className='item-price'>{(parsePrice(item.item_price) * (quantities[item.itemId] || 1)).toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div>No items in cart</div>
        )}
      </div>
      <div className="cart-total-card">
        <div className='card-align'> 
        <h4 className='total-cart-items'>Total Items: {totalItems}</h4>
        <button className='coupon-button'>Add coupon code  +</button>
        <h4 className='cart-total-price'>Total Cart Price: {totalPrice.toFixed(2)}</h4>
        <button className='payment-buttons mpesa-button'>
          <p> M-</p>
          <div className='mpesa-phone-icon'></div>
          <p>pesa</p>
        </button>

        <button className='payment-buttons paypal-button'> <FaPaypal className='paypal-logo' /> <span className='paypal-context'>Paypal</span> </button>
        <button className='payment-buttons credit-card-button'><FaCreditCard className='credit-card-icon'/> <span>Debit or Credit card</span></button>
        </div>
      </div>
    </div>
  );
}

export default Maincartpage;

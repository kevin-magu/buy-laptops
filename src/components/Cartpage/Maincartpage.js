import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { db, storage } from '../../Firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

function Maincartpage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state for loading

  const [userEmail, setUserEmail] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email); // Update userEmail state
      } else {
        setUser(null);
        setUserEmail(''); // Reset userEmail state
      }
      setLoading(false); // Set loading to false once the check is done
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // fetching items from cart
  useEffect(() => {
    const fetchItemsFromCart = async () => {
      try {
        if (userEmail) {
          const itemsCollection = collection(db, `cart/${userEmail}/items`);
          const itemsSnapshot = await getDocs(itemsCollection);
          const itemsList = itemsSnapshot.docs.map(doc => doc.data());
          setCartItems(itemsList);

          const cartItemsIdArray = itemsList.map(item => item.itemId);

          const storageRef = ref(storage, `laptop-images`);
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
                  console.error("Error fetching image URL:", error);
                  // You can add a placeholder image URL here (e.g., newImageUrls.push('https://via.placeholder.com/150'))
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
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    if (userEmail) {
      fetchItemsFromCart();
    }
  }, [userEmail]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth state
  }

  return (
    <div className='cart-main-page-wrapper'>
      <h4 className='cart-heading'>Cart</h4>
      <div className='items-main-section'>
        <h3 className='item-category'>Laptops</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className='item-main-section'>
              <div className='item-image' style={{ backgroundImage: `url(${imageUrls[index] || 'placeholder.jpg'})` }}></div>
              <div className='item-quantity'>Quantity: {item.quantity}</div>
              <div className='item-price'>Price: {item.item_price}</div>
              
            </div>
          ))
        ) : (
          <div>No items in cart</div>
        )}
      </div>
    </div>
  );
}

export default Maincartpage;

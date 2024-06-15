import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, storage } from '../../Firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

function Maincartpage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [quantities, setQuantities] = useState({});

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
          itemsList.forEach(item => {
            initialQuantities[item.itemId] = item.quantity || 1;
          });
          setQuantities(initialQuantities);
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
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const parsePrice = (price) => {
    return parseFloat(price.replace(/,/g, ''));
  };

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
            <div>
            <div key={item.itemId} className='item-main-section'>
              <div className='item-image' style={{ backgroundImage: `url(${imageUrls[index] || 'placeholder.jpg'})` }}></div>
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

              <div className="">

              </div>


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

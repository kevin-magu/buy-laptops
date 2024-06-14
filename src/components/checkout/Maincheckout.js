import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { storage, db } from '../../Firebaseconfig';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { doc, getDocs, collection, addDoc } from 'firebase/firestore';
import "../../style/ProductDetails.css";
import { FaShoppingCart } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';

function Checkout() {
  const [laptopDetails, setLaptopDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfLaptops, setNumberOfLaptops] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [itemsInLocalCart, setItemsInLocalCart] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('id');
  
  const substringProductId = productId.substring(0, 8)
  console.log("substring id", substringProductId)

  useEffect(() => {
    const fetchLaptopDetails = async () => {
      try {
        // Fetch laptop details from Firestore
        const querySnapshot = await getDocs(collection(db, "laptop_details"));
        const laptopDetails = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(detail => detail.product_id === productId);

        if (laptopDetails) {
          setLaptopDetails(laptopDetails);

        // Fetch images from Firebase Storage
          const email = laptopDetails.email; // Assuming email is used as part of the path
          const imageRef = ref(storage, `laptop-images/${email}`);
          const imageItems = await listAll(imageRef);
          const imageUrls = await Promise.all(imageItems.items
            .filter(item => item.name.substring(0, 8) === substringProductId)
            .map(item => getDownloadURL(item)));

          setImages(imageUrls);
        } else {
          console.error("No such document!");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching laptop details:", error);
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchLaptopDetails();
    }
  }, [productId]);

  // Log the length of itemsInLocalCart whenever it changes
  useEffect(() => {
    console.log("Items in local storage length", itemsInLocalCart.length);
    console.log(itemsInLocalCart);
  }, [itemsInLocalCart]);

  // Function to handle clicking of an image
  const handleImageGalleryClick = (index) => {
    setCurrentIndex(index);
  };

  // Get the current authenticated user
  useEffect(() => {
    const authInstance = getAuth();
    if (authInstance.currentUser) {
      setCurrentEmail(authInstance.currentUser.email);
    } else {
      console.log("Not logged in");
    }
  }, []);

  // Sync itemsInLocalCart with local storage
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('itemsInLocalCart')) || [];
    setItemsInLocalCart(storedItems);
  }, []);

  useEffect(() => {
    localStorage.setItem('itemsInLocalCart', JSON.stringify(itemsInLocalCart));
  }, [itemsInLocalCart]);

  // Function to handle adding items to cart
  const addItemToCart = async () => {
    const authInstance = getAuth();
    if (authInstance.currentUser === null) {
      setItemsInLocalCart(prevItems => {
        if (!prevItems.includes(productId)) {
          return [...prevItems, productId];
        }
        return prevItems;
      });
    } else {
      const userEmail = authInstance.currentUser.email;
      const dbRef = doc(db, "cart", userEmail);
      const itemDetailsCart = collection(dbRef, "items");
      try {
        setAddingToCart(true);
        const uploading = await addDoc(itemDetailsCart, {
          itemId: productId,
          item_price: laptopDetails.laptop_price,
        });
        if (uploading) {
          setAddingToCart(false);
          console.log("Product sent to cart");
        }
      } catch (error) {
        console.error("There was an error uploading item details", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!laptopDetails) {
    return <div>No laptop details found.</div>;
  }

  return (
    <div className="product-details-wrapper">
      <div className="details-card">
        <div className="details-image" style={{ backgroundImage: `url(${images[currentIndex] || 'placeholder.jpg'})` }}></div>
        <div className="checkout-card-details">
          <button className='add-to-cart-button' onClick={addItemToCart}>
            {addingToCart ? "Adding to Cart" : "Add to cart"} <FaShoppingCart />
          </button>
          <h1 className='laptop-name'>{laptopDetails.laptop_name}</h1>
          <p><strong>Storage:</strong> {laptopDetails.laptop_storage}</p>
          <p><strong>Memory:</strong> {laptopDetails.laptop_memory}</p>
          <p><strong>Processor:</strong> {laptopDetails.laptop_processor}</p>
          <p><strong>Price:</strong> {laptopDetails.laptop_price}</p>
          <p className='product-description'><strong>Description:</strong></p>
          <p>{laptopDetails.laptop_description}</p>
          <div className='bottom-elements'>
            <p>Quantity</p>
            <input
              type="number"
              className='quantity-input'
              value={numberOfLaptops}
              onChange={(e) => setNumberOfLaptops(e.target.value)}
            />
            <button className='proceed-to-payment-button'>Proceed to Payment</button>
          </div>
        </div>
      </div>

      <div className="image-gallery-wrapper">
        {images.map((url, index) => (
          <div
            key={index}
            className="image-gallery"
            style={{ backgroundImage: `url(${url})` }}
            onClick={() => handleImageGalleryClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Checkout;

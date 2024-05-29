import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { storage, db } from '../../Firebaseconfig';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { doc, getDocs, collection } from 'firebase/firestore';
import "../../style/ProductDetails.css"

function Checkout() {
  const [laptopDetails, setLaptopDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfLaptops, setNumberOfLaptops] = useState(1)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('id').substring(0, 8);

  useEffect(() => {
    const fetchLaptopDetails = async () => {
      try {
        // Fetch laptop details from Firestore
        const querySnapshot = await getDocs(collection(db, "laptop_details"));
        const laptopDetails = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(detail => detail.product_id.substring(0, 8) === productId);
          
        if (laptopDetails) {
          setLaptopDetails(laptopDetails);

          // Fetch images from Firebase Storage
          const email = laptopDetails.email; // Assuming email is used as part of the path
          const imageRef = ref(storage, `laptop-images/${email}`);
          const imageItems = await listAll(imageRef);

          const imageUrls = await Promise.all(imageItems.items
            .filter(item => item.name.substring(0, 8) === productId)
            .map(item => getDownloadURL(item)));
            
          setImages(imageUrls);
          console.log("this are the images from firebase", imageUrls)
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

  const handleImageChange = (direction) => {
    setCurrentIndex((prevIndex) => (prevIndex + direction + images.length) % images.length);
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
          <h1 className='laptop-name'>{laptopDetails.laptop_name}</h1>
          <p><strong>Storage:</strong> {laptopDetails.laptop_storage}</p>
          <p><strong>Memory:</strong> {laptopDetails.laptop_memory}</p>
          <p><strong>Processor:</strong> {laptopDetails.laptop_processor}</p>
          <p><strong>Price:</strong> {laptopDetails.laptop_price}</p>
          <p className='product-description'><strong>Description:</strong> </p>
          <p>{laptopDetails.laptop_description}</p>
         <div className='bottom-elements'>
            <p>Quantity</p>
            <input type="number" className='quanity-input' value={numberOfLaptops} onChange={(e) => setNumberOfLaptops(e.target.value)}/>
            <button className='proceed-to-payment-button'>Proceed to Payment</button>
          </div>
        </div>  
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default Checkout;

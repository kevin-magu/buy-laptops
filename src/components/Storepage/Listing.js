import React, { useState, useEffect } from 'react';
import { storage, db } from '../../Firebaseconfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
//import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

function Listing() {
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImagesAndDetails = async () => {
      try {
        const storageRef = ref(storage, 'laptop-images/');
        const items = await listAll(storageRef);
        const productImages = {};

        // Fetch images from Firebase Storage
        for (let prefix of items.prefixes) {
          const prefixRef = ref(storage, `laptop-images/${prefix.name}`);
          const emailContents = await listAll(prefixRef);
          for (let item of emailContents.items) {
            const url = await getDownloadURL(item);
            const productId = item.name.substring(0, 6);
            productImages[productId] = productImages[productId] || { images: [], currentIndex: 0 };
            productImages[productId].images.push(url);
          }
        }

        // Fetch product details from Firestore
        const querySnapshot = await getDocs(collection(db, "laptop_details"));
        const laptopDetails = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Combine the details with images
        laptopDetails.forEach(detail => {
          const detailProductId = detail.product_id.substring(0, 6);
          if (productImages[detailProductId]) {
            productImages[detailProductId].details = detail;
          }
        });

        setProducts(productImages);
        setIsLoading(false);
      } catch (error) {
        console.error("An error occurred:", error);
        setIsLoading(false);
      }
    };

    fetchImagesAndDetails();
  }, []);

  const handleImageChange = (productId, direction) => {
    setProducts(currentProducts => ({
      ...currentProducts,
      [productId]: {
        ...currentProducts[productId],
        currentIndex: (currentProducts[productId].currentIndex + direction + currentProducts[productId].images.length) % currentProducts[productId].images.length,
      }
    }));
  };

  return (
    <div className='listing-container'>
      {isLoading ? <div>Loading...</div> : (
        Object.entries(products).map(([productId, details]) => (
          <div key={productId} className="card">
            <div className="card-image-wrapper">
              <div className="card-image-skeleton" style={{ display: details.images.length === 0 || !details.images[details.currentIndex] ? 'block' : 'none' }}>
                {/* Add your skeleton UI here */}
              </div>
              <div className="card-image" style={{ backgroundImage: `url(${details.images[details.currentIndex] || 'placeholder.jpg'})` }}></div>
              
              
            </div>
            {details.details && (
              <Link className='link' to={`/checkout?id=${details.details.product_id}`}>
                <div className='laptop-details'>
                  <div className='laptopname-div'><h4 className='laptop-name'>{details.details.laptop_name}</h4></div>
                  <h4>STORAGE: {details.details.laptop_storage}</h4>
                  <h4> MEMORY: {details.details.laptop_memory}</h4>
                  <h4>CPU: {details.details.laptop_processor}</h4>
                  <h4>PRICE: {details.details.laptop_price}</h4>
                </div>
              </Link>
            )}
            <div className='button-div'><button className='checkout-button'>Add to cart</button></div>
          </div>
        ))
      )}
    </div>
  );
}

export default Listing;

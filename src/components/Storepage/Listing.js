import React, { useState, useEffect } from 'react';
import { storage } from '../../Firebaseconfig'; // Assuming Firebaseconfig imports storage
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function Listing() {
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'laptop-images/');
        const items = await listAll(storageRef);

        const productImages = {};

        for (let prefix of items.prefixes) {
          const prefixRef = ref(storage, `laptop-images/${prefix.name}`);
          const emailContents = await listAll(prefixRef);

          for (let item of emailContents.items) {
            const url = await getDownloadURL(item);
            const productId = item.name.substring(0, 6);

            if (!productImages[productId]) {
              productImages[productId] = { images: [], currentIndex: 0 };
            }
            productImages[productId].images.push(url);
          }
        }

        setProducts(productImages);
        setIsLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("An Error occurred when fetching images:", error);
      }
    };

    fetchImages();
  }, []); // Empty dependency array to fetch once

  const handleImageChange = (productId, direction) => {
    try {
      setProducts(currentProducts => ({
        ...currentProducts,
        [productId]: {
          ...currentProducts[productId],
          currentIndex: (currentProducts[productId].currentIndex + direction + currentProducts[productId].images.length) % currentProducts[productId].images.length,
        }
      }));
    } catch (error) {
      console.error("An Error occurred when updating image index:", error);
    }
  };

  const handleImageLoaded = (productId) => {
    try {
      setProducts(currentProducts => ({
        ...currentProducts,
        [productId]: {
          ...currentProducts[productId],
          isLoading: false // Mark image as loaded individually
        }
      }));
    } catch (error) {
      console.error("An Error occurred when marking image loaded:", error);
    }
  };

  return (
    <div className='listing-container'>
      {isLoading ? (
        <div>Loading...</div> // Display loading indicator initially
      ) : (
        Object.entries(products).map(([productId, details]) => (
          <div key={productId} className="card">
            <div 
              className="card-image"
              style={{ 
                backgroundImage: `url(${details.images[details.currentIndex] || 'placeholder.jpg'})`,
                
              }}
            >
              {/* Remove the img tag */}
            </div>
            <button onClick={() => handleImageChange(productId, -1)} className='previous-button'>Previous</button>
            <button onClick={() => handleImageChange(productId, 1)} className='next-button'>Next</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Listing;

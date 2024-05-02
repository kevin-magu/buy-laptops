import React, { useState, useEffect } from 'react';
import { storage, db } from '../../Firebaseconfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';

function Listing() {
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
            productImages[productId] = productImages[productId] || { images: [], currentIndex: 0 };
            productImages[productId].images.push(url);
          }
        }

        // After images are fetched, fetch product details
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
        console.error("An Error occurred:", error);
        setIsLoading(false);
      }
    };

    fetchImages();
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
            <div className="card-image" style={{ backgroundImage: `url(${details.images[details.currentIndex] || 'placeholder.jpg'})` }}></div>
            <button onClick={() => handleImageChange(productId, -1)} className='previous-button'>Previous</button>
            <button onClick={() => handleImageChange(productId, 1)} className='next-button'>Next</button>
            {details.details && (
              <div>
                <h3>{details.details.laptop_name}</h3>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Listing;

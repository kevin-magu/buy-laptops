import React, { useState, useEffect } from 'react';
import { storage } from '../../Firebaseconfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function Listing() {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'laptop-images/');
        const items = await listAll(storageRef);

        const productImages = {};

        // Organize images by product ID (assuming product ID is the first six characters of the filename)
        for (let prefix of items.prefixes) {
          const prefixRef = ref(storage, `laptop-images/${prefix.name}`);
          const emailContents = await listAll(prefixRef);

          for (let item of emailContents.items) {
            const url = await getDownloadURL(item);
            const productId = item.name.substring(0, 6); // First six characters as product ID

            if (!productImages[productId]) {
              productImages[productId] = { images: [], currentIndex: 0 };
            }
            productImages[productId].images.push(url);
          }
        }

        setProducts(productImages);
      } catch (error) {
        console.error("An Error occured when fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  // Handler to change the current image index
  const handleImageChange = (productId, direction) => {
    setProducts(currentProducts => ({
      ...currentProducts,
      [productId]: {
        ...currentProducts[productId],
        currentIndex: (currentProducts[productId].currentIndex + direction + currentProducts[productId].images.length) % currentProducts[productId].images.length === currentProducts[productId].images.length ? 0 : (currentProducts[productId].currentIndex + direction + currentProducts[productId].images.length) % currentProducts[productId].images.length
      }
    }));
  };

  return (
    <div className='listing-container'>
      {Object.entries(products).map(([productId, details]) => (
        <div key={productId} className="card">
          <div className="card-image" style={{ backgroundImage: `url(${details.images[details.currentIndex] || 'placeholder.jpg'})` }}></div>
          <button onClick={() => handleImageChange(productId, -1)}>p</button>
          <button onClick={() => handleImageChange(productId, 1)}>N</button>
        </div>
      ))}
    </div>
  );
}

export default Listing;

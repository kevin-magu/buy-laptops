import React, { useState, useEffect } from 'react';
import { storage } from '../../Firebaseconfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function Listing() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'laptop-images/');
        const items = await listAll(storageRef);  // Get the list of directories once
        console.log("Number of prefixes (directories):", items.prefixes.length);

        const allImages = [];

        // Loop through each directory (prefix)
        for (let prefix of items.prefixes) {
          const prefixRef = ref(storage, `laptop-images/${prefix.name}`);
          const emailContents = await listAll(prefixRef);

          // Fetch all images from this directory
          for (let item of emailContents.items) {
            const url = await getDownloadURL(item);
            allImages.push({
              name: item.name,
              url: url,
              email: prefix.name  // Assuming the prefix name is the email
            });
          }
        }

        setCards(allImages);  // Store all image data in state
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className='listing-container'>
      {cards.map((card, index) => (
        <div key={index} className="card" style={{ backgroundImage: `url(${card.url})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '200px', height: '200px' }}>
          <p>{card.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Listing;

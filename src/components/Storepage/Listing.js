import React, { useState, useEffect } from 'react';
import { storage } from '../../Firebaseconfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function Listing() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const paths = []
        const storageRef  = ref(storage, 'laptop-images/')
        const items = listAll(storageRef);
        console.log(items )
        for (const item in storageRef){
            paths.push(item)
        }

      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className='listing-container'>
      
    </div>
  );
}

export default Listing;

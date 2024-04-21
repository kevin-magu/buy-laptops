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
        let itemsLength = ((await items).prefixes.length)
        console.log(itemsLength)
        
        paths.push((await items).prefixes[0].name)
        //const items2 = (await items).prefixes[0].name
       
        console.log("this is a path", paths)
       

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

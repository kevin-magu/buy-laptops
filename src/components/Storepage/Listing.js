import React, { useState, useEffect } from 'react';
import { storage } from '../../Firebaseconfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function Listing() {
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                // Fetch listings from the storage
                const listRef = ref(storage, 'laptop-images');
                const listResult = await listAll(listRef);

                // Fetch images for each product
                const imageUrls = [];
                for (const item of listResult.items) {
                    const downloadUrl = await getDownloadURL(item);
                    imageUrls.push(downloadUrl);
                }
                setImages(imageUrls);
            } catch (error) {
                console.error("Error fetching listings", error);
            }
        }
        fetchUserListings();
    }, []);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }

    return (
        <div className='listing-container'>
            <div className="card">
                <div className="card-title"></div>
                <button onClick={handlePrevImage}>Previous</button>
                <div className="card-image" style={images.length > 0 ? { backgroundImage: `url(${images[currentImageIndex]})` } : {} }></div>
                <button onClick={handleNextImage}>Next</button>
            </div>
        </div>
    );
}

export default Listing;

import React, {useState, useEffect} from 'react'
import { storage,db } from '../../Firebaseconfig'
import { ref,listAll,getDownloadURL } from 'firebase/storage'

function Listing() {
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState([0])

    useEffect(() => {
        const fetchUserListings = async () => {
            try{
                //fetch listings from my collection
                const querySnapshot = await db.collection("laptop-images").get();
                const productIDs = querySnapshot.docs.map((doc) =>doc.id)
           
                //fetch images for each procuct 
                const imageUrls = []
                for(const productId of productIDs){
                    const imageRefs = await listAll(ref(storage, `laptop-images/${productId}`));
                    const downloadUrls = await Promise.all(imageRefs.items.map((item) => getDownloadURL(item)))
                    imageUrls.push(...downloadUrls);
                }   
                setImages(imageUrls);
            }catch(error){
                console.error("error fetching listings", error)
            }
        }
        fetchUserListings();

    }, []);

 const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex===0? images.length-1:prevIndex-1))
 }
 
 const handleNextImage = () =>{
    setCurrentImageIndex((prevIndex) =>(prevIndex===images.length-1?0:prevIndex +1))
 }
  return (
    <div className='listing-container'>
        <div className="card">
            <div className="card-title"></div>
            <button>previous</button>
            <div className="card-image" style={{backgroundImage: `url(${images[currentImageIndex]})`}}></div>
            <button>next</button>
        </div>
    </div>
  )
}

export default Listing
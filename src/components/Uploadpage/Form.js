import React, { useState, useEffect } from "react"; // Added useEffect import
import { storage } from "../../Firebaseconfig";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { auth } from "../../Firebaseconfig";

function Form() {
  const [img, setImg] = useState('');
  const [error, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // State for user email

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUserEmail(user.email); // Set the user's email in state
        console.log("Current user's email:", user.email);
      } else {
        // No user is signed in
        setUserEmail(null); // Reset user email
        console.log("No logged in user");
      }
    });

    // Unsubscribe from authentication state changes when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures effect runs only once after initial render

  const handleImgSubmit = async (e) => {
    e.preventDefault();

    if (!img) {
      setStatus("Please insert an image");
      return;
    }

    try {
      setIsUploading(true);
      const imgRef = ref(storage, `${userEmail}/${v4()}`);
      
      await uploadBytes(imgRef, img);
      setStatus("Image upload successful");
    } catch (error) {
      setIsUploading(false);
      console.error(error);
      setStatus("Error uploading image. Please try again later.");
    }
  }

  return (
    <div className='formpage'>
      <p className='formpage-title'>UPLOAD YOUR LAPTOP DETAILS</p>
      <form onSubmit={handleImgSubmit}>
        <div className='leftside'>
          <p className="error-message">{error}</p>
          <input
            type='text'
            placeholder='laptop name'
          />
          <input
            type='text'
            placeholder='laptop price'
          />
          <textarea
            cols='30'
            rows='10'
            placeholder='Enter the laptop description'
          ></textarea>
          <input type='file' onChange={(e) => setImg(e.target.files[0])}/>
          <button type='button' onClick={handleImgSubmit}>{isUploading ? 'Uploading' : 'Upload'}</button>
        </div>

        <div className='rightside'>
          <p className='rightside-p1'>Enter laptop name</p>
          <p className='rightside-p2'>Enter laptop Price in Kenyan Shilling</p>
          <p className='rightside-p3'>Enter laptop description</p>
          <p className='rightside-p5'>Select a laptop image to upload from your device</p>
          <p className='rightside-p4'>Click upload button</p>
        </div>
      </form>
    </div>
  );
}

export default Form;

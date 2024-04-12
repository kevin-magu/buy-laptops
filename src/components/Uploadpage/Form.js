import React, { useState } from "react"; // Added React import
import { storage } from "../../Firebaseconfig";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { auth } from "../../Firebaseconfig";

function Form() {
  if(auth.currentUser!==null){
  const userEmiail =auth.currentUser.email
  console.log(userEmiail)
  }else{
    console.log("no logged in user")
  }

  const [img, setImg] = useState('');
  const [error, setStatus] = useState(''); // Changed variable name from error to status
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImgSubmit = async (e) => { // Added async to handle asynchronous upload operation
    e.preventDefault();

    if (!img) {
      setStatus("Please insert an image");
      return;
    }
  
    try {
      setIsUploading(true)
      const imgRef = ref(storage, `laptop-images/${v4()}`);
      await uploadBytes(imgRef, img); // Changed to await for asynchronous upload operation
      setStatus("Image upload successful");
    } catch (error) {
      setIsUploading(false)
      console.error(error); // Changed to console.error for better error handling
      setStatus("Error uploading image. Please try again later.");
    }
  }
  
  return (
    <div className='formpage'>
      <p className='formpage-title'>UPLOAD YOUR LAPTOP DETAILS</p>
      <form onSubmit={handleImgSubmit}>
        
        <div className='leftside'>
        <p className="error-message">{error}</p> {/* Corrected className */}
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
          <input type='file' onChange={(e)=>setImg(e.target.files[0])}/>
          <button type='button' onClick={handleImgSubmit}>{isUploading? 'Uploading': 'Upload'}</button>
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

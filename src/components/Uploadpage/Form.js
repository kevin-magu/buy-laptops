import { useState } from "react";
import { storage } from "../../Firebaseconfig";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";


function Form(){
const [img, setImg] =useState('')
const [error, setError] = useState('')
const handleImgSubmit = () =>{

  const imgRef = ref(storage, `files/{$v4()}`)
  uploadBytes(imgRef, img)
  
  
  
}


  return (
    <div className='formpage'>
      <p className='formpage-title'>UPLOAD YOUR LAPTOP DETAILS</p>
      <form >
        <p className="error-messag">{setError}</p>
        <div className='leftside'>
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
          <button type='submit' onClick={handleImgSubmit}>UPLOAD</button>
         
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

import React, { useState } from 'react';

import { storage, db,auth } from '../../Firebaseconfig';

function Form() {
  const [laptopName, setLaptopName] = useState('');
  const [laptopPrice, setLaptopPrice] = useState('');
  const [laptopDescription, setLaptopDescription] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!laptopName || !laptopPrice || !laptopDescription || !image) {
        setErrorMessage('All fields are required.');
        return;
      }

      const laptopId = db.collection('laptops').doc().id;

      const uploadTask = storage.ref(`images/${laptopId}`).put(image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          setErrorMessage('Error uploading image.');
          console.error('Error uploading image:', error);
        },
        () => {
          storage
            .ref('images')
            .child(laptopId)
            .getDownloadURL()
            .then((url) => {
              db.collection('laptops')
                .doc(laptopId)
                .set({
                  laptopName,
                  laptopPrice,
                  laptopDescription,
                  imageURL: url,
                  userId: user.uid,
                  createdAt: new Date(),
                })
                .then(() => {
                  setLaptopName('');
                  setLaptopPrice('');
                  setLaptopDescription('');
                  setImage(null);
                  setProgress(0);
                  setErrorMessage('');
                })
                .catch((error) => {
                  setErrorMessage('Error saving data to Firestore.');
                  console.error('Error saving data to Firestore:', error);
                });
            })
            .catch((error) => {
              setErrorMessage('Error getting download URL.');
              console.error('Error getting download URL:', error);
            });
        }
      );
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='formpage'>
      <p className='formpage-title'>UPLOAD YOUR LAPTOP DETAILS</p>
      <form onSubmit={handleSubmit}>
        <div className='leftside'>
          <input
            type='text'
            placeholder='laptop name'
            value={laptopName}
            onChange={(e) => setLaptopName(e.target.value)}
          />
          <input
            type='text'
            placeholder='laptop price'
            value={laptopPrice}
            onChange={(e) => setLaptopPrice(e.target.value)}
          />
          <textarea
            cols='30'
            rows='10'
            placeholder='Enter the laptop description'
            value={laptopDescription}
            onChange={(e) => setLaptopDescription(e.target.value)}
          ></textarea>
          <input type='file' onChange={handleImageChange} />
          <button type='submit'>UPLOAD</button>
          {progress > 0 && <progress value={progress} max='100' />}
          {errorMessage && <div>{errorMessage}</div>}
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

function Form(){


  

  return (
    <div className='formpage'>
      <p className='formpage-title'>UPLOAD YOUR LAPTOP DETAILS</p>
      <form >
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
          <input type='file' />
          <button type='submit'>UPLOAD</button>
         
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

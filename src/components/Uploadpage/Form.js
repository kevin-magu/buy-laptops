import React from 'react'

function Form() {
  return (
    <div className='formpage'>
      <form method='post'>

        <div className='leftside'>
          <input type="text" placeholder='laptop name'/>
          <input type="text" placeholder='laptop price'/>
          <textarea cols="30" rows="10" placeholder='Enter the laprop description'></textarea> 
          <input type="file" placeholder='laptop price'/>
          <button>UPLOAD</button>
        </div>

        <div className="rightside">
          
        </div>
      </form>
    </div>
  )
}

export default Form
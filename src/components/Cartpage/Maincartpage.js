import React from 'react'

function Maincartpage() {
/* 
  loop through storage and get the image of the laptop with the same ID
*/


  return (
    <div className='cart-main-page-wrapper'>
        <h4 className='cart-heading'>Cart</h4>
        <div className='items-main-section'>
            <h3 className='item-category'>Laptops</h3>
            <div className='item-main-section'>
                <div className='item-image'></div>
                <div className='item-quantity'></div>
                <div className='item-price'></div>
                <div className='item-total-price'></div>
            </div>
        </div>
    </div>
  )
}

export default Maincartpage
import React, { useEffect, useState } from 'react'
import { db, storage } from '../../Firebaseconfig'
import { collection, getDocs } from 'firebase/firestore'
import { auth } from '../../Firebaseconfig'
import userEvent from '@testing-library/user-event'
function Maincartpage() {
/* 
  loop through storage and get the image of the laptop with the same ID
*/
    const [userEmail,setUserEmail] = useState('')
    const [cartItems, setCartItems] = useState('')
    const [iteamId, setItemsId] = useState([])

    useEffect (() =>{
      const user = auth.currentUser
      if(user){
        setUserEmail(user.email)
      }
    }, [])
    
    useEffect(() =>{
        const fetchItemsfromCart = async () =>{
          if(userEmail){
          try{
            const itemsCollection = collection(db, `cart/${userEmail}/items`)
            const itemsSnapshot = await getDocs(itemsCollection);
            const itemsList = itemsSnapshot.docs.map(doc => doc.data())
            setCartItems(itemsList)
            console.log("items from database",cartItems)

          }catch(error){
            console.error("error fetching cart items", error) 
          }
      }
      
    }
    fetchItemsfromCart()
    }, [userEmail])
  
  
  
  
  
  
  
  

  
  
  
    console.log("this is the user email",userEmail)

    const getCartItemsImages = async () => {
    const cartItemsIds= []
    
    
    
} 

getCartItemsImages()
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
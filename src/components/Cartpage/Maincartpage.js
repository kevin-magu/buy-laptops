import React, { useEffect, useState } from 'react'
import { db, storage } from '../../Firebaseconfig'
import { collection, getDocs,doc } from 'firebase/firestore'
import { auth } from '../../Firebaseconfig'
import userEvent from '@testing-library/user-event'
function Maincartpage() {
/* 
  loop through storage and get the image of the laptop with the same ID
*/
    const [userEmail,setUserEmail] = useState('')
    const [cartItems, setCartItems] = useState('')
    const [iteamId, setItemsId] = useState([])
    const [laptopPrice, setLaptopPrice] = useState('')

    useEffect (() =>{
      const user = auth.currentUser
      if(user){
        setUserEmail(user.email)
      }
    }, [])
    
    useEffect(() =>{
        const fetchItemsfromCart = async () =>{
          if(true){
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

  //pull data from firestore

  useEffect(() => {
    const getLaptopIdsForCart= async () =>{
      const dbRef = collection(db, `laptop_details/`)
      const getLaptopDetails = await getDocs(dbRef)
      const laptopPrice = doc.map(doc => doc.data())
      setLaptopPrice(laptopPrice)
    }
  
  },[])

  
  
  console.log("this is the user email",userEmail)
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
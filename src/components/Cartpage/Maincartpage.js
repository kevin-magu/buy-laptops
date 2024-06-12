import React, { useEffect, useState } from 'react'
import { db, storage } from '../../Firebaseconfig'
import { collection, getDocs,doc } from 'firebase/firestore'
import { auth } from '../../Firebaseconfig'
import userEvent from '@testing-library/user-event'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
function Maincartpage() {
/* 
  loop through storage and get the image of the laptop with the same ID
*/
    const [userEmail,setUserEmail] = useState('')
    const [cartItems, setCartItems] = useState('')
    const [iteamId, setItemsId] = useState([])
    const [laptopPrice, setLaptopPrice] = useState('')
    const imageUrls = []

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
            const itemsCollection = collection(db, `cart/wanjaukevinmagu@gmail.com/items`)
            const itemsSnapshot = await getDocs(itemsCollection);
            const itemsList = itemsSnapshot.docs.map(doc => doc.data())
            setCartItems(itemsList)
            console.log("items from database",itemsList)
            
           /* for(let item in cartItems.itemId){
                cartItemsArray.push(item)
            } */
           console.log("this are the item ids",itemsList)
           console.log("itemlist length", itemsList.length)
           const cartItemsIdArray = []
           for(let i =0; i<itemsList.length; i++){
            cartItemsIdArray.push(itemsList[i].itemId)
           }
           console.log(cartItemsIdArray);

           //get image matching the id from cart
           const storageRef = ref(storage, `laptop-images`)
           const emailDirectories = await listAll(storageRef)
           const emailContents = await listAll(prefixes.fullPath)

           
           for(let prefixes of emailDirectories.prefixes){
             
             
             
          } 

           console.log("image urls",imageUrls)
          
          }catch(error){
            console.error("error fetching cart items", error) 
          }
      }
      
    }
    // 
    fetchItemsfromCart()
    }, [userEmail])

  //pull data from firestore

  useEffect(() => {
    const getLaptopIdsForCart= async () =>{
      const dbRef = collection(db, `laptop_details`)
      const getLaptopDetails = await getDocs(dbRef)
      const laptopPrice = getLaptopDetails.docs.map(doc => doc.data())
      setLaptopPrice(laptopPrice)
      
    }
    getLaptopIdsForCart()
  
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
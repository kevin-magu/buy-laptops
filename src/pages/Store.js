import '../style/Store.css'
import Search from '../components/Storepage/Search'
import Listing from '../components/Storepage/Listing'
function Store(){
    return(
        <div className='store-container'>
            <Search />
            <Listing />
        </div>

    )
}

export default Store
import { Link } from "react-router-dom";
import Macbook from  "../../images/macbook.png"


function Herosection(){
    return(
        <div className="hero-section">
            <div className="mac-div"><img src={Macbook} alt="" className="mac" /></div>
            <p>Top Tech. Unbeatable Deals.</p>
            
                <Link to="/store" className="button-div" >
                    <button>View Laptop Store</button>
                </Link>
            
            <div className="input-div">
                <input type="email" placeholder="enter your email"/><button>SUBSCRIBE TO OUR NEWS LETTER</button>
            </div>
        </div>
    )
}
export default Herosection;

import React, { useState } from 'react'
import './Header.css'

const Header = () => {
    const [menu, setMenu] = useState("home");

    return (
        <div className='header' id='home'>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                {/* <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p> */}
                <button>
                    <a href="#explore-menu" onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>
                        View Menu
                    </a>
                </button>
            </div>
        </div>
    )
}

export default Header

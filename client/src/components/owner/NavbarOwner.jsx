import React from 'react'
import { Link } from "react-router-dom";
import { assets, dummyUserData } from "../../assets/assets";

const NavbarOwner = () => {

    const user = dummyUserData;

    return (
        <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all">
            {/* Go to home page on clicking the StatLogo */}
            <Link to="/"><img src={assets.StatLogo} alt="" className="h-7" /> </Link>
            <p>Welcome, {user.name || "Owner"}</p>
        </div>
    );
};

export default NavbarOwner;
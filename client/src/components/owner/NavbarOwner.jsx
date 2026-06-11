import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../Context/app-context";

const NavbarOwner = () => {

    const { user } = useAppContext();

    return (
        <div className="relative flex items-center justify-between border-b border-borderColor px-6 py-4 text-gray-500 transition-all dark:border-gray-700 dark:text-gray-400 md:px-10">
            {/* Go to home page on clicking the StatLogo */}
            <Link to="/"><img src={assets.StatLogo} alt="" className="h-7" /> </Link>
            <p>Welcome, {user.name || "Owner"}</p>
        </div>
    );
};

export default NavbarOwner;

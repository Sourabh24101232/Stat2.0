import { useState } from 'react'
import toast from 'react-hot-toast'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { useLocation } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useAppContext } from '../../Context/AppContext';

const Sidebar = () => {

    const { user, axios, fetchUser } = useAppContext();
    const location = useLocation();

    //update image
    const [image, setImage] = useState(null);
    const updateImage = async () => {
        try {
            const formData = new FormData()
            formData.append('image', image)

            const { data } = await axios.post('/api/owner/update-image', formData)
            if (!data.success) {
                toast.error(data.message)
                return
            }

            await fetchUser()
            setImage(null)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (

        // Sidebar
        <div className="relative min-h-screen w-full max-w-13 flex-col items-center border-r border-borderColor pt-8 text-sm dark:border-gray-700 md:flex md:max-w-60">

            {/*Profile Section */}
            <div className="group relative">
                <label htmlFor="image">

                    {/* Profile Image */}
                    <img src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"} alt="" className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' />
                    {/* Clicking image opens file picker. */}
                    <input type="file" id="image" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
                    {/* Edit Icon Overlay , Initially hidden but When mouse enters profile image: group-hover:flex makes overlay visible. */}
                    <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
                        <img src={assets.edit_icon} alt="" />
                    </div>

                </label>
            </div>

            {/* Save Button , the button is rendered only when image is not null i.e., after the user selects an image */}
            {image && (
                <button className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer" onClick={updateImage}>Save<img src={assets.check_icon} width={13} alt="" /></button>)
            }

            {/* User Name , Hidden on small screens.*/}
            <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

            {/* Navigation Links */}
            <div className="w-full">
                {ownerMenuLinks.map((link, index) => (
                    <NavLink key={index} to={link.path} className={`relative flex w-full items-center gap-2 py-3 pl-4 first:mt-6 ${link.path === location.pathname ? "bg-primary/10 text-primary" : "text-gray-600 dark:text-gray-300"}`} >
                        {/* Current page Shows colored icon, Other pages Shows normal icon */}
                        <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />
                        <span className="max-md:hidden">{link.name}</span>
                        {/* Right Highlight Bar , Current page gets: blue vertical bar on the right side.*/}
                        <div className={`${link.path === location.pathname && "bg-primary"} w-1.5 h-8 rounded-l right-0 absolute`} ></div>
                    </NavLink>
                ))}
            </div>

        </div>
    )
}

export default Sidebar

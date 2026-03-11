import { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../../context/AuthContext.jsx"
import assets from '../assets/assets.js'

function ProfilePage() {
    const {authUser,updateProfile} = useContext(AuthContext)

    const [selectedImg,setSelectedImg] = useState(null)
    const [name,setName] = useState(authUser.fullName)
    const [bio,setBio] = useState(authUser.bio)
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if(!selectedImg){ //if image not selected
            await updateProfile({bio,fullName:name})
            navigate('/') //so when the form is submitted then user is navigated to "/" i.e homePage
            return
        }
        //now if there is image then 1st we need to convert the image to base 64..just por por do these steps for base64 conversion..then call updateProfile()
        const reader = new FileReader()
        reader.readAsDataURL(selectedImg)
        reader.onload = async() => {
            const base64Image = reader.result
            await updateProfile({profilePic:base64Image,bio,fullName:name})
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
            <div className="w-5/6 max-w-2xl backdrop-blur-3xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
                <form className="flex flex-col gap-5 p-10 flex-1" onSubmit={onSubmitHandler}>
                    <h3 className="text-lg">Profile details</h3>
                    <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">{/* this contains the upload image input box */}
                        <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden/> {/* this is the input form where we
                        are going to upload the profile picture..ei input field ta hidden thakbe but input field tar sathe label er connection ache through id and htmlFor..so uplaod image text tay click korle(infact not only the text..label tag er jekono jaygay mane img tay click korleo hbe) input box active hoe jabe */} {/* files is an array */}
                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon } alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>{/* URL.createObjectURL(selectedImg) ei in built function ta selectedImg er url create kore debe and oi url tai source hisebe use hbe if selectedImg is true mane jei photo ta select korlam ota show hbe else avatar icon show hbe */}
                        upload profile image
                    </label>
                    <input onChange={(e) => setName(e.target.value)} value={name}
                    type="text" required placeholder="Your name"
                    className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />{/* input box for entering name */}
                    <textarea onChange={(e) => setBio(e.target.value)} value={bio}
                    placeholder="Write profile bio" rows={4} required
                    className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    ></textarea>{/* text area for entering bio */}
                    <button type="submit"
                    className='bg-linear-to-r from-green-400 to-green-600 text-white p-2 rounded-full text-lg cursor-pointer'>
                        Save
                    </button>
                </form> {/* this is the form where user can give their name,bio and upload profile pic*/}
                <img src={authUser?.profilePic||assets.logo_big} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} alt="" /> {/* the profile pic of the user will be shown here */}
            </div>
        </div>
    )
}

export default ProfilePage


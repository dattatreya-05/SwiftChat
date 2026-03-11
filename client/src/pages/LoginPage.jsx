import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import assets from '../assets/assets.js'

function LoginPage() {
    const [currentState,setCurrentState] = useState("Sign up")
    const [fullName,setFullName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [bio,setBio] = useState("")
    const [isDataSubmitted,setIsDataSubmitted] = useState(false) //jokhon data like name,email,password submit hoye jabe during sign-up tokhon etake true kore debo and eta true hole a new input box will be shown to enter bio

    const {login} = useContext(AuthContext) //grabbed the login function from AuthContext

    const onSubmitHandler = (event) => {
        event.preventDefault(); //this will stop the default behavior of submitting which is reloading the webpage
        if(currentState === "Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true)
            return
        }
        login(currentState === "Sign up" ? 'signup' : 'login',{fullName,email,password,bio}) //form ta jokhon submit hbe tokhon run this function er jonnei submitHandler e rakha hoeche
    }

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
            {/* ------ LEFT ------ this contains the logo */}
            <div className="flex flex-col items-center">
                <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
                <h2 className="mt-2 text-2xl font-semibold text-white">SwiftChat</h2>
            </div>

            {/* ------ RIGHT ------ */} {/* this is the signup/login card */}
            <form onSubmit={onSubmitHandler}
            className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'> {/* this is the signup/login card */}
                {/* HEADING */}
                <h2 className='font-medium text-2xl flex justify-between items-center'>
                    {currentState}
                    {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
                </h2>{/* the heading */}

                {/* ENTER FULL NAME */}
                {currentState === "Sign up" && !isDataSubmitted && ( /* jodi currentState signUp hoy,r data submitted jodi false hoy mane data submitted ekhono hoyni taholei ei input box ta ke dekhabo noile hide kore rakho */
                    <input onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    type="text"
                    className='p-2 border border-gray-500 rounded-md focus:outline-none'
                    placeholder='Full Name' required/> /* this is "enter full name" wala input box which is required */
                )}

                {/* ENTER EMAIL AND PASSWORD */}
                {!isDataSubmitted && ( /* data submitted jodi false hoy mane data submitted ekhono hoyni taholei show these input boxes */
                    <>
                        <input onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Email Address' required/>{/* this is email wala input box */}
                        
                        <input onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Password' required/>{/* this is password wala input box */}
                    </>
                )}

                {/* ENTER BIO */}
                {currentState === "Sign up" && isDataSubmitted && ( /* jodi currentState signUp hoy,r data submitted jodi true hoy mane data submitted already hoe geche tokhon ei input box ta show koro */
                    <textarea rows={4}
                    className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    placeholder='Provide a short bio'
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                )}

                {/* BUTTON */}
                <button type='submit'
                className='py-3 bg-linear-to-r from-green-400 to-green-600 text-white rounded-full cursor-pointer'
                >
                    {currentState === "Sign up" ? "Sign-up" : "Log-in"}
                </button>

                {/* FEW EXTRA THINGS */}
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type="checkbox" />
                    <p>Agree to the terms and policy</p>
                </div>

                {/* THE LOGIN OR SIGNUP LINK */}
                <div className='flex flex-col gap-2'>
                    {currentState === "Sign up" ? (
                        <p className='text-sm text-gray-600'>
                            Already have an account?
                            <span onClick={() => {setCurrentState("Login");setIsDataSubmitted(false)}}
                            className='font-medium text-green-500 cursor-pointer'>
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p className='text-sm text-gray-600'>
                            Create an account
                            <span onClick={() => {setCurrentState("Sign up")}}
                            className='font-medium text-green-500 cursor-pointer'>
                                Click here
                            </span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage


import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = ({ setShowLogin }) => {
    const [mode, setMode] = useState('signin')
    const [showPassword, setShowPassword] = useState(false)

    const isSignUp = mode === 'signup'
    const isResetPassword = mode === 'reset'

    const onSubmitHandler = async (event) => {
        event.preventDefault()
    }

    return (
        <div onClick={() => { setShowLogin(false) }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 text-sm text-gray-600 backdrop-blur-sm">

            <div onClick={(event) => event.stopPropagation()} className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
                
                {/* Left image */}
                <div className="hidden w-1/2 md:block">
                    <img className="h-full w-full object-cover" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png" alt="leftSideImage" />
                </div>

                {/* Form in right side */}
                <div className="flex w-full flex-col items-center justify-center px-6 py-10 md:w-1/2 md:px-10">
                    <form onSubmit={onSubmitHandler} className="flex w-full max-w-sm flex-col items-center justify-center">

                        <h2 className="text-4xl font-medium text-gray-900">
                            {isResetPassword ? 'Reset password' : isSignUp ? 'Sign up' : 'Login'}
                        </h2>
                        <p className="mt-3 text-center text-sm text-gray-500/90">
                            {isResetPassword
                                ? 'Enter your email and we will send reset instructions'
                                : isSignUp
                                    ? 'Create an account to continue'
                                    : 'Welcome back! Please login to continue'}
                        </p>

                        {!isResetPassword && (
                            <>
                                {/* Google button  */}
                                <button type="button" className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-gray-500/10">
                                    <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="googleLogo" />
                                </button>

                                {/* Login with email button  */}
                                <div className="my-5 flex w-full items-center gap-4">
                                    <div className="h-px w-full bg-gray-300/90"></div>
                                    <p className="w-full text-nowrap text-sm text-gray-500/90">
                                        or {isSignUp ? 'sign up' : 'login'} with email
                                    </p>
                                    <div className="h-px w-full bg-gray-300/90"></div>
                                </div>
                            </>
                        )}

                        {isSignUp && (
                            <div className="mb-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z" fill="#6B7280" />
                                </svg>
                                <input type="text" placeholder="Full name" className="h-full w-full bg-transparent text-sm text-gray-500/80 outline-none placeholder-gray-500/80" required />
                            </div>
                        )}

                        {/* Email id  */}
                        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                            </svg>
                            <input type="email" placeholder="Email id" className="h-full w-full bg-transparent text-sm text-gray-500/80 outline-none placeholder-gray-500/80" required />
                        </div>

                        {!isResetPassword && (
                            <>
                                {/* Password */}
                                <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent px-6">
                                    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                                    </svg>
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="h-full w-full bg-transparent text-sm text-gray-500/80 outline-none placeholder-gray-500/80" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex h-12 w-12 shrink-0 items-center justify-center" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        <img src={showPassword ? assets.eye_close_icon : assets.eye_icon} alt="" className="h-10 w-10 opacity-80" />
                                    </button>
                                </div>

                                {/* Remember me and forget password */}
                                <div className="mt-8 flex w-full items-center justify-between text-gray-500/80">
                                    <div className="flex items-center gap-2">
                                        <input className="h-5" type="checkbox" id="checkbox" />
                                        <label className="text-sm" htmlFor="checkbox">Remember me</label>
                                    </div>
                                    <button type="button" onClick={() => setMode('reset')} className="text-sm underline">
                                        Forgot password?
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Submit button */}
                        <button type="submit" className="mt-8 h-11 w-full rounded-full bg-indigo-500 text-white transition-opacity hover:opacity-90">
                            {isResetPassword ? 'Send reset link' : isSignUp ? 'Create account' : 'Login'}
                        </button>

                        <p className="mt-4 text-sm text-gray-500/90">
                            {isResetPassword ? 'Remember your password?' : isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                type="button"
                                onClick={() => setMode(isSignUp || isResetPassword ? 'signin' : 'signup')}
                                className="ml-1 text-indigo-400 hover:underline"
                            >
                                {isSignUp || isResetPassword ? 'Login' : 'Sign up'}
                            </button>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login

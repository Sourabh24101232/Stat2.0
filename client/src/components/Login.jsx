import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'
import { useTranslation } from 'react-i18next'

const Login = () => {
    // Authentication state and helpers shared through AppContext.
    const { axios, setShowLogin, completeAuthentication } = useAppContext()
    const googleButtonRef = useRef(null)
    const googleAuthInProgress = useRef(false)
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const { t } = useTranslation('common')

    // mode decides which authentication form is displayed.
    const [mode, setMode] = useState('signin')
    const [showPassword, setShowPassword] = useState(false)

    // Controlled input values shared by the different forms.
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Boolean helpers make mode-based conditions easier to read.
    const isSignUp = mode === 'signup'
    const isResetPassword = mode === 'reset'
    const isVerifyEmail = mode === 'verify'
    const isSetNewPassword = mode === 'new-password'

    // Choose the heading for the active form.
    let heading = t('auth.login')

    if (isVerifyEmail) {
        heading = t('auth.verifyEmail')
    } else if (isSetNewPassword) {
        heading = t('auth.newPassword')
    } else if (isResetPassword) {
        heading = t('auth.resetPassword')
    } else if (isSignUp) {
        heading = t('auth.signUp')
    }

    let description

    if (isVerifyEmail) {
        description = t('auth.verifyDescription')
    } else if (isSetNewPassword) {
        description = t('auth.newPasswordDescription')
    } else if (isResetPassword) {
        description = t('auth.resetDescription')
    } else if (isSignUp) {
        description = t('auth.signUpDescription')
    } else {
        description = t('auth.loginDescription')
    }

    // Choose the button label and show feedback while a request is running.
    let submitButtonText = t('auth.login')

    if (isSubmitting) {
        submitButtonText = t('auth.pleaseWait')
    } else if (isVerifyEmail) {
        submitButtonText = t('auth.verifyEmail')
    } else if (isSetNewPassword) {
        submitButtonText = t('auth.resetPassword')
    } else if (isResetPassword) {
        submitButtonText = t('auth.sendResetCode')
    } else if (isSignUp) {
        submitButtonText = t('auth.createAccount')
    }

    // Send Google's ID token to the backend and save the app's JWT response.
    const handleGoogleCredential = useCallback(async (response) => {
        if (!response.credential || googleAuthInProgress.current) return

        try {
            googleAuthInProgress.current = true
            setIsSubmitting(true)

            const { data } = await axios.post('/api/user/google-auth', {
                credential: response.credential,
            })

            if (!data.success) {
                toast.error(data.message || t('auth.googleFailed'))
                return
            }

            completeAuthentication(data)
            toast.success(t('auth.googleSuccess'))
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || t('auth.googleFailed'))
        } finally {
            googleAuthInProgress.current = false
            setIsSubmitting(false)
        }
    }, [axios, completeAuthentication, t])

    // Initialize Google Identity Services after its external script is ready.
    useEffect(() => {
        if (!googleClientId || isResetPassword || isVerifyEmail || isSetNewPassword) return

        const initializeGoogleButton = () => {
            if (!window.google?.accounts?.id || !googleButtonRef.current) return

            googleButtonRef.current.replaceChildren()
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleCredential,
            })
            window.google.accounts.id.renderButton(googleButtonRef.current, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: isSignUp ? 'signup_with' : 'signin_with',
                shape: 'pill',
                width: 350,
            })
        }

        const googleScript = document.getElementById('google-client-script')

        if (window.google?.accounts?.id) {
            initializeGoogleButton()
        } else {
            googleScript?.addEventListener('load', initializeGoogleButton)
        }

        return () => {
            googleScript?.removeEventListener('load', initializeGoogleButton)
        }
    }, [googleClientId, handleGoogleCredential, isResetPassword, isSetNewPassword, isSignUp, isVerifyEmail])


    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            setIsSubmitting(true)

            // Login is the default request. Other modes replace these values.
            let endpoint = '/api/user/login'
            let payload = { email, password }

            // Match the current form with its backend endpoint and request body.
            if (isSignUp) {
                endpoint = '/api/user/register'
                payload = { name, email, password }
            } else if (isVerifyEmail) {
                endpoint = '/api/user/verify-otp'
                payload = { email, otp }
            } else if (isResetPassword) {
                endpoint = '/api/user/forgot-password'
                payload = { email }
            } else if (isSetNewPassword) {
                endpoint = '/api/user/reset-password'
                payload = { email, otp, password }
            }

            // Send the authentication request through the shared Axios instance.
            const { data } = await axios.post(endpoint, payload)

            // An unverified login attempt should continue on the OTP form.
            if (!data.success) {
                if (data.needsVerification) {
                    setOtp('')
                    setMode('verify')
                }
                toast.error(data.message || 'Authentication failed')
                return
            }

            // A returned token means authentication is complete.
            if (data.token) {
                completeAuthentication(data)
                toast.success(data.message || 'Logged in successfully')
                return
            }

            toast.success(data.message)

            // Move to the next form for registration and password-reset flows.
            if (isSignUp) {
                setOtp('')
                setMode('verify')
            } else if (isResetPassword) {
                setOtp('')
                setPassword('')
                setMode('new-password')
            } else if (isSetNewPassword) {
                setOtp('')
                setPassword('')
                setMode('signin')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Unable to connect to the server')
        } finally {
            // Restore the submit button after either success or failure.
            setIsSubmitting(false)
        }
    }

    const resendVerificationOtp = async () => {
        try {
            setIsSubmitting(true)
            const { data } = await axios.post('/api/user/resend-otp', { email })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message || 'Unable to resend OTP')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Unable to resend OTP')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        // Clicking the overlay closes the login modal.
        <div onClick={() => { setShowLogin(false) }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 text-sm text-gray-600 backdrop-blur-sm dark:text-gray-300">

            {/* Clicking inside the card must not close the modal. */}
            <div onClick={(event) => event.stopPropagation()} className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]">

                {/* Left image */}
                <div className="hidden w-1/2 md:block">
                    <img className="h-full w-full object-cover" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png" alt="leftSideImage" />
                </div>

                {/* Form in right side */}
                <div className="flex w-full flex-col items-center justify-center px-6 py-10 md:w-1/2 md:px-10">
                    <form onSubmit={onSubmitHandler} className="flex w-full max-w-sm flex-col items-center justify-center">

                        <h2 className="text-4xl font-medium text-gray-900 dark:text-gray-100">
                            {heading}
                        </h2>
                        <p className="mt-3 text-center text-sm text-gray-500/90 dark:text-gray-400">
                            {description}
                        </p>

                        {!isResetPassword && !isVerifyEmail && !isSetNewPassword && (
                            <>
                                {/* Google handles both account creation and login. */}
                                <div className="mt-8 flex min-h-11 w-full justify-center" ref={googleButtonRef}></div>

                                {/* Login with email button  */}
                                <div className="my-5 flex w-full items-center gap-4">
                                    <div className="h-px w-full bg-gray-300/90 dark:bg-gray-700"></div>
                                    <p className="w-full text-nowrap text-center text-sm text-gray-500/90 dark:text-gray-400">
                                    {t('auth.orWithEmail', { action: isSignUp ? t('auth.signUp') : t('auth.login') })}
                                    </p>
                                    <div className="h-px w-full bg-gray-300/90 dark:bg-gray-700"></div>
                                </div>
                            </>
                        )}

                        {isSignUp && (
                            <div className="mb-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6 dark:border-gray-700">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z" fill="#6B7280" />
                                </svg>
                                <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder={t('auth.fullName')} autoComplete="name" className="h-full w-full bg-transparent text-sm text-gray-500/80 outline-none placeholder-gray-500/80 dark:text-gray-200 dark:placeholder-gray-400" required />
                            </div>
                        )}

                        {/* Email is required in every authentication mode. */}
                        {/* Email id  */}
                        <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent pl-6 dark:border-gray-700">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                            </svg>
                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('auth.email')} autoComplete="email" className="h-full w-full bg-transparent text-sm text-gray-500/80 outline-none placeholder-gray-500/80 dark:text-gray-200 dark:placeholder-gray-400" required />
                        </div>

                        {/* OTP is used for email verification and password reset. */}
                        {(isVerifyEmail || isSetNewPassword) && (
                            <div className="mt-6 flex h-12 w-full items-center overflow-hidden rounded-full border border-gray-300/60 bg-transparent px-6 dark:border-gray-700">
                                <input type="text" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={t('auth.otp')} inputMode="numeric" autoComplete="one-time-code" minLength={6} maxLength={6} className="h-full w-full bg-transparent text-sm tracking-widest text-gray-500/80 outline-none placeholder:tracking-normal placeholder-gray-500/80 dark:text-gray-200 dark:placeholder-gray-400" required />
                            </div>
                        )}

                        {/* Password is hidden when requesting a reset code or verifying email. */}
                        {!isResetPassword && !isVerifyEmail && (
                            <>
                                {/* Password */}
                                <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-gray-300/60 bg-transparent px-6 dark:border-gray-700">
                                    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                                    </svg>
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSetNewPassword ? t('auth.newPasswordPlaceholder') : t('auth.password')} autoComplete={isSignUp || isSetNewPassword ? 'new-password' : 'current-password'} minLength={isSignUp || isSetNewPassword ? 8 : undefined} className="h-full w-full bg-transparent text-sm text-gray-500/80 outline-none placeholder-gray-500/80 dark:text-gray-200 dark:placeholder-gray-400" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex h-12 w-12 shrink-0 items-center justify-center" aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}>
                                        <img src={showPassword ? assets.eye_close_icon : assets.eye_icon} alt="" className="h-10 w-10 opacity-80" />
                                    </button>
                                </div>

                                {/* Remember me and forget password */}
                                {!isSignUp && !isSetNewPassword && <div className="mt-8 flex w-full justify-end text-gray-500/80 dark:text-gray-400">
                                    <button type="button" onClick={() => setMode('reset')} className="text-sm underline">
                                        {t('auth.forgotPassword')}
                                    </button>
                                </div>}
                            </>
                        )}

                        {/* Submit button */}
                        <button type="submit" disabled={isSubmitting} className="mt-8 h-11 w-full rounded-full bg-indigo-500 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                            {submitButtonText}
                        </button>

                        {isVerifyEmail && (
                            <button type="button" disabled={isSubmitting || !email} onClick={resendVerificationOtp} className="mt-4 text-sm text-indigo-500 hover:underline disabled:cursor-not-allowed disabled:opacity-60">
                                {t('auth.resendCode')}
                            </button>
                        )}

                        <p className="mt-4 text-sm text-gray-500/90 dark:text-gray-400">
                            {isVerifyEmail || isSetNewPassword || isResetPassword ? t('auth.returnToLogin') : isSignUp ? t('auth.alreadyAccount') : t('auth.noAccount')}
                            <button
                                type="button"
                                onClick={() => {
                                    // Clear sensitive values before changing forms.
                                    setOtp('')
                                    setPassword('')
                                    setMode(isSignUp || isResetPassword || isVerifyEmail || isSetNewPassword ? 'signin' : 'signup')
                                }}
                                className="ml-1 text-indigo-400 hover:underline"
                            >
                                {isSignUp || isResetPassword || isVerifyEmail || isSetNewPassword ? t('auth.login') : t('auth.signUp')}
                            </button>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const AppContext = createContext(null)

// Kept with the provider so AppContext has a single public module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error('useAppContext must be used inside AppProvider')
    }

    return context
}

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem("token")));
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCars] = useState([]);

    const clearAuthentication = useCallback(() => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common.Authorization
        setToken(null)
        setUser(null)
        setIsOwner(false)
        setAuthLoading(false)
    }, [])

    const completeAuthentication = useCallback((data) => {
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
        setToken(data.token)
        setUser(data.user)
        setIsOwner(data.user?.role === 'owner')
        setAuthLoading(false)
        setShowLogin(false)
    }, [])

    // Check that the stored token still represents an active server session.
    const fetchUser = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/user/data')
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            } else {
                clearAuthentication()
            }
        } catch (error) {
            clearAuthentication()
            if (error.response?.status !== 401) {
                toast.error(error.response?.data?.message || error.message);
            }
        } finally {
            setAuthLoading(false)
        }
    }, [clearAuthentication]);

    //function to fetch all cars from the server
    const fetchCars = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/user/cars')
            data.success ? setCars(data.cars) : toast.error(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }, [])

    // Revoke the current server session before clearing browser state.
    const logout = async () => {
        try {
            if (token) {
                await axios.post('/api/user/logout')
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                toast.error(error.response?.data?.message || error.message)
            }
        } finally {
            clearAuthentication()
            navigate('/')
            toast.success('You have been logged out!')
        }
    };

    useEffect(() => {
        if (!token) {
            delete axios.defaults.headers.common.Authorization
            return
        }

        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const restoreSession = async () => {
            await fetchUser()
        }

        restoreSession()
    }, [fetchUser, token]);

    useEffect(() => {
        const loadCars = async () => {
            await fetchCars()
        }

        loadCars()
    }, [fetchCars]);

    // Any rejected protected request should remove the stale local session.
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && token) {
                    clearAuthentication()
                }
                return Promise.reject(error)
            }
        )

        return () => axios.interceptors.response.eject(interceptor)
    }, [clearAuthentication, token])

    //Context Value Object , Everything inside becomes globally available.
    const value = {
        navigate, currency, axios, user, setUser, token, setToken,
        isOwner, setIsOwner, authLoading, fetchUser, showLogin, setShowLogin,
        completeAuthentication, clearAuthentication, logout,
        fetchCars, cars, setCars,
        pickupDate, setPickupDate, returnDate, setReturnDate,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

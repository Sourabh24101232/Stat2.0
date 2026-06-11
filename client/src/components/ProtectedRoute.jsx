import { Navigate } from 'react-router-dom'
import Loader from './Loader'
import { useAppContext } from '../Context/app-context'

const ProtectedRoute = ({ children, ownerOnly = false }) => {
    const { user, isOwner, authLoading } = useAppContext()

    if (authLoading) {
        return <Loader />
    }

    if (!user || (ownerOnly && !isOwner)) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute

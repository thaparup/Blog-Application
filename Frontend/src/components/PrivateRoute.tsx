import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"


const PrivateRoute = () => {
    const { isTokenExpired } = useUserStore()
    return (
        isTokenExpired() ? <Navigate to="/sign-in" /> : <Outlet />
    )
}

export default PrivateRoute
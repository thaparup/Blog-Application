import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"


const PrivateRoute = () => {
    const { isTokenExpired, accessToken } = useUserStore()
    return (
        isTokenExpired(accessToken!) ? <Navigate to="/sign-in" /> : <Outlet />
    )
}

export default PrivateRoute
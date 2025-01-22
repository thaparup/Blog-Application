import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"
import SignIn from "../assets/pages/SignIn"


const PrivateRoute = () => {
    const { isTokenExpired } = useUserStore()

    return (
        isTokenExpired() ? <SignIn /> : <Outlet />
    )
}

export default PrivateRoute
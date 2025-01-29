import React from 'react'
import { useUserStore } from '../store/useUserStore'
import { Navigate, Outlet } from 'react-router-dom'

const OnlyAdminPrivateRoute = () => {
    const { user } = useUserStore()

    return (
        user && user?.isAdmin ? (<Outlet />) : <Navigate to='sign-in' />
    )
}

export default OnlyAdminPrivateRoute
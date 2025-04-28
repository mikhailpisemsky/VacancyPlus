import { useState, useCallback, useEffect } from 'react'

const storageMame = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userStatus, setUserStatus] = useState(null);

    const login = useCallback((jwtToken, id, status) => {
        setToken(jwtToken)
        setUserId(id)
        setUserStatus(status)

        localStorage.setItem(storageMame, JSON.stringify({
            userId: id, token: jwtToken, userStatus: status
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUserStatus(null)
        localStorage.removeItem(storageMame)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageMame))

        if (data && data.token) {
            login(data.token, data.userId, data.userStatus)
        }
    }, [login])

    return { login, logout, token, userId, userStatus }
}
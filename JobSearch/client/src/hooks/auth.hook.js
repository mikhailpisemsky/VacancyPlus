import { useState, useCallback, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const storageName = 'userData'; // Исправляем опечатку в названии переменной

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userStatus, setUserStatus] = useState(null);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserStatus(null);
        localStorage.removeItem(storageName);
    }, []);

    const login = useCallback((jwtToken, id = null, status = null) => {
        try {
            const decoded = jwtDecode(jwtToken);
            const verifiedUserId = decoded?.id || id; // Изменяем с userId на id
            const verifiedStatus = decoded?.status || status;

            if (!verifiedUserId || !verifiedStatus) {
                throw new Error('Неполные данные авторизации');
            }

            setToken(jwtToken);
            setUserId(verifiedUserId);
            setUserStatus(verifiedStatus);

            localStorage.setItem(storageName, JSON.stringify({
                token: jwtToken,
                userId: verifiedUserId,
                userStatus: verifiedStatus
            }));
        } catch (e) {
            console.error('Ошибка при логине:', e);
            logout();
            throw e; // Пробрасываем ошибку для обработки в компоненте
        }
    }, [logout]);    

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data?.token) {
            try {
                const decoded = jwtDecode(data.token);
                // Проверяем данные как из localStorage, так и из токена
                const verifiedUserId = decoded?.userId || data.userId;
                const verifiedStatus = decoded?.status || data.userStatus;

                if (verifiedUserId && verifiedStatus) {
                    login(data.token, verifiedUserId, verifiedStatus);
                } else {
                    localStorage.removeItem(storageName);
                }
            } catch (e) {
                localStorage.removeItem(storageName);
            }
        }
        setReady(true);
    }, [login]);

    return {
        login,
        logout,
        token,
        userId,
        userStatus,
        ready,
        isAuthenticated: !!token,
        isEmployer: userStatus === 'employer',
        isStudent: userStatus === 'student'
    };
};
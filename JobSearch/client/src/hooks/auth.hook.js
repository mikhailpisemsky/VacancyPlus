import { useState, useCallback, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const storageName = 'userData'; // Исправляем опечатку в названии переменной

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userStatus, setUserStatus] = useState(null);

    const login = useCallback((jwtToken, id = null, status = null) => {
        try {
            // Декодируем токен
            const decoded = jwt_decode(jwtToken);

            // Проверяем данные в токене
            const verifiedUserId = decoded?.userId || id;
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
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserStatus(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data?.token) {
            try {
                const decoded = jwt_decode(data.token);
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
        isEmployer: userStatus === 'employer',
        isStudent: userStatus === 'student'
    };
};
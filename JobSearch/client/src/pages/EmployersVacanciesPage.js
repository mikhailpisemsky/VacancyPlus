import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const EmployersVacanciesPage = () => {
    const { loading, request, error, clearError } = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [vacancies, setVacancies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Обработка ошибок
    useEffect(() => {
        if (error) {
            message(error);
            clearError();

            if (error === 'Нет авторизации' || error.includes('401')) {
                auth.logout();
                navigate('/');
            }
        }
    }, [error, message, clearError, auth, navigate]);

    // Загрузка вакансий
    const fetchVacancies = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await request(
                'http://localhost:5000/api/empvacancies/my-vacancies',
                'GET',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );
            setVacancies(data);
        } catch (e) {
            console.error('Полный текст ошибки', e);
        } finally {
            setIsLoading(false);
        }
    }, [request, auth.token]);

    useEffect(() => {
        if (!auth.token) {
            navigate('/');
            return;
        }
        fetchVacancies();
    }, [fetchVacancies, auth.token, navigate]);

    if (!auth.token) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="center" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="preloader-wrapper big active">
                    <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '1200px' }}>      
            <div className="card">
                <div className="card-content">
                    {vacancies.length > 0 ? (
                        <table className="highlight">
                            <thead>
                                <tr>
                                    <th>Должность</th>
                                    <th>Тип</th>
                                    <th>Статус</th>
                                    <th>Дата создания</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vacancies.map(vacancy => (
                                    <tr key={vacancy.id} style={{ cursor: 'pointer' }}>
                                        <td onClick={() => navigate(`/vacancies/${vacancy.id}`)}>{vacancy.position}</td>
                                        <td onClick={() => navigate(`/vacancies/${vacancy.id}`)}>{vacancy.type}</td>
                                        <td onClick={() => navigate(`/vacancies/${vacancy.id}`)}>
                                            <span className={`badge ${vacancy.status === 'опубликована' ? 'green' : 'grey'}`}>
                                                {vacancy.status}
                                            </span>
                                        </td>
                                        <td onClick={() => navigate(`/vacancies/${vacancy.id}`)}>
                                            {new Date(vacancy.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-flat waves-effect"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/vacancies/${vacancy.id}`);
                                                }}
                                                disabled={loading}
                                            >
                                                Подробнее
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="center" style={{ padding: '40px 0' }}>
                            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>У вас пока нет созданных вакансий</p>
                            <button
                                className="btn waves-effect waves-light"
                                onClick={() => navigate('/create')}
                                style={{ marginTop: '15px' }}
                                disabled={loading}
                            >
                                Создать первую вакансию
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Pagination } from '../components/Pagination';

export const EmployersVacanciesPage = () => {
    const { loading, request, error, clearError } = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [vacancies, setVacancies] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        limit: 10,
        totalPages: 1
    });
    const [statusFilter, setStatusFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const formatSalary = (min, max) => {
        const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num);

        if (min === 0 && max === 0) return 'Нет данных';
        if (min === 0) return `до ${formatNumber(max)} ₽`;
        if (max === 0) return `от ${formatNumber(min)} ₽`;
        return `от ${formatNumber(min)} до ${formatNumber(max)} ₽`;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'created': return { class: 'blue', text: 'Создана' };
            case 'posted': return { class: 'green', text: 'Опубликована' };
            case 'closed': return { class: 'grey', text: 'Закрыта' };
            default: return { class: 'grey', text: status };
        }
    };

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

    const fetchVacancies = useCallback(async () => {
        try {
            setIsLoading(true);
            const page = searchParams.get('page') || 1;
            const status = searchParams.get('status') || '';

            const query = new URLSearchParams({
                page,
                limit: 10,
                ...(status && { status })
            }).toString();

            const data = await request(
                `http://localhost:5000/api/empvacancies/my-vacancies?${query}`,
                'GET',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );

            setVacancies(data.vacancies);
            setPagination({
                page: data.page,
                total: data.total,
                limit: 10,
                totalPages: data.totalPages
            });
            setStatusFilter(status);
        } catch (e) {
            console.error('Ошибка загрузки:', e);
        } finally {
            setIsLoading(false);
        }
    }, [request, auth.token, searchParams]);

    useEffect(() => {
        if (!auth.token || auth.userStatus !== 'employer') {
            navigate('/');
            return;
        }
        fetchVacancies();
    }, [fetchVacancies, auth.token, auth.userStatus, navigate]);


    const handlePageChange = (page) => {
        navigate(`?status=${statusFilter}&page=${page}`);
    };

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
                        <>
                            <table className="highlight responsive-table">
                                <thead>
                                    <tr>
                                        <th>Должность</th>
                                        <th>Компания</th>
                                        <th>Тип</th>
                                        <th>Зарплата</th>
                                        <th>Статус</th>
                                        <th>Дата создания</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vacancies.map(vacancy => {
                                        const status = getStatusBadge(vacancy.status);
                                        return (
                                            <tr key={vacancy.id}>
                                                <td>{vacancy.position}</td>
                                                <td>{vacancy.company}</td>
                                                <td>{vacancy.type}</td>
                                                <td>{formatSalary(vacancy.minSalary, vacancy.maxSalary)}</td>
                                                <td>
                                                    <span className={`badge ${status.class}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(vacancy.createdAt).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-small blue"
                                                        onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                                                        disabled={loading}
                                                    >
                                                        {loading ? 'Подробнее...' : 'Подробнее'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="center" style={{ marginTop: '30px' }}>
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="center" style={{ padding: '40px 0' }}>
                            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
                                {statusFilter
                                    ? `Нет вакансий со статусом "${getStatusBadge(statusFilter).text.toLowerCase()}"`
                                    : 'У вас пока нет созданных вакансий'
                                }
                            </p>
                            <button
                                className="btn waves-effect waves-light blue"
                                onClick={() => navigate('/create')}
                                style={{ marginTop: '15px' }}
                            >
                                Создать вакансию
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
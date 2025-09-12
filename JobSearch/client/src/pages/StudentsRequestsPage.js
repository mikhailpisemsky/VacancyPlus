import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Pagination } from '../components/Pagination';

export const StudentsRequestsPage = () => {
    const { loading, request, error, clearError } = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [applications, setApplications] = useState([]);
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
            case 'posted': return { class: 'blue', text: 'Отправлена' };
            case 'accepted': return { class: 'green', text: 'Принята' };
            case 'rejected': return { class: 'red', text: 'Отклонена' };
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

    const fetchApplications = useCallback(async () => {
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
                `http://localhost:5000/api/applications?${query}`,
                'GET',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );

            setApplications(data.applications);
            setPagination({
                page: data.page,
                total: data.total,
                limit: 10,
                totalPages: data.totalPages
            });
            setStatusFilter(status);
        } catch (e) {
            console.error('Ошибка загрузки заявок:', e);
        } finally {
            setIsLoading(false);
        }
    }, [request, auth.token, searchParams]);

    const handleDeleteApplication = async (applicationId) => {
        if (!window.confirm('Вы уверены, что хотите отозвать заявку?')) {
            return;
        }

        try {
            await request(
                `http://localhost:5000/api/applications/${applicationId}`,
                'DELETE',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );
            
            message('Заявка успешно отозвана');
            fetchApplications();
        } catch (e) {
            message(e.message || 'Ошибка при отзыве заявки');
        }
    };

    useEffect(() => {
        if (!auth.token || auth.userStatus !== 'student') {
            navigate('/');
            return;
        }
        fetchApplications();
    }, [fetchApplications, auth.token, auth.userStatus, navigate]);

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
                    <h4 className="center" style={{ marginBottom: '30px' }}>Мои отклики на вакансии</h4>

                    {applications.length > 0 ? (
                        <>
                            <table className="highlight responsive-table">
                                <thead>
                                    <tr>
                                        <th>Должность</th>
                                        <th>Компания</th>
                                        <th>Тип работы</th>
                                        <th>Зарплата</th>
                                        <th>Статус заявки</th>
                                        <th>Дата подачи</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(application => {
                                        const status = getStatusBadge(application.applicationStatus);
                                        const canDelete = application.applicationStatus === 'posted';
                                        
                                        return (
                                            <tr key={application.applicationId}>
                                                <td>{application.vacancy?.position || 'Не указано'}</td>
                                                <td>{application.vacancy?.company || 'Не указано'}</td>
                                                <td>{application.vacancy?.type || 'Не указано'}</td>
                                                <td>
                                                    {application.vacancy ? 
                                                        formatSalary(application.vacancy.minSalary, application.vacancy.maxSalary) 
                                                        : 'Нет данных'
                                                    }
                                                </td>
                                                <td>
                                                    <span className={`badge ${status.class}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(application.createdAt).toLocaleDateString('ru-RU', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                        <button
                                                            className="btn-small blue"
                                                            onClick={() => navigate(`/request/${application.applicationId}`)}
                                                            disabled={loading}
                                                            title="Подробнее о заявке"
                                                        >
                                                            <i className="material-icons">visibility</i>
                                                        </button>
                                                        
                                                        {canDelete && (
                                                            <button
                                                                className="btn-small red"
                                                                onClick={() => handleDeleteApplication(application.applicationId)}
                                                                disabled={loading}
                                                                title="Отозвать заявку"
                                                            >
                                                                <i className="material-icons">delete</i>
                                                            </button>
                                                        )}
                                                    </div>
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
                                    ? `Нет заявок со статусом "${getStatusBadge(statusFilter).text.toLowerCase()}"`
                                    : 'У вас пока нет отправленных заявок'
                                }
                            </p>
                            <button
                                className="btn waves-effect waves-light blue"
                                onClick={() => navigate('/search')}
                                style={{ marginTop: '15px' }}
                            >
                                Посмотреть вакансии
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
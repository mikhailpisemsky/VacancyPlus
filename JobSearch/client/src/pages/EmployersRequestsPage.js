import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Pagination } from '../components/Pagination';

export const EmployersRequestsPage = () => {
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

    useEffect(() => {
        if (!auth.token || auth.userStatus !== 'employer') {
            navigate('/');
            return;
        }
        fetchApplications();
    }, [fetchApplications, auth.token, auth.userStatus, navigate]);

    const handlePageChange = (page) => {
        navigate(`?status=${statusFilter}&page=${page}`);
    };

    const handleStatusFilterChange = (newStatus) => {
        navigate(`?status=${newStatus}&page=1`);
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
        <div className="container" style={{ padding: '20px', maxWidth: '1400px' }}>
            <div className="card">
                <div className="card-content">
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col s12">
                            <h4>Отклики на мои вакансии</h4>

                            <div className="row" style={{ marginTop: '20px' }}>
                                <div className="col s12">
                                    <div className="flex-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <button
                                            className={`btn-small ${statusFilter === '' ? 'blue' : 'grey'}`}
                                            onClick={() => handleStatusFilterChange('')}
                                        >
                                            Все
                                        </button>
                                        <button
                                            className={`btn-small ${statusFilter === 'posted' ? 'blue' : 'grey'}`}
                                            onClick={() => handleStatusFilterChange('posted')}
                                        >
                                            Отправленные
                                        </button>
                                        <button
                                            className={`btn-small ${statusFilter === 'accepted' ? 'green' : 'grey'}`}
                                            onClick={() => handleStatusFilterChange('accepted')}
                                        >
                                            Принятые
                                        </button>
                                        <button
                                            className={`btn-small ${statusFilter === 'rejected' ? 'red' : 'grey'}`}
                                            onClick={() => handleStatusFilterChange('rejected')}
                                        >
                                            Отклоненные
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {applications.length > 0 ? (
                        <>
                            <div className="responsive-table">
                                <table className="highlight">
                                    <thead>
                                        <tr>
                                            <th>Должность</th>
                                            <th>Компания</th>
                                            <th>Зарплата</th>
                                            <th>Статус заявки</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(application => {
                                            const status = getStatusBadge(application.applicationStatus);

                                            return (
                                                <tr key={application.applicationId}>
                                                    <td>{application.vacancy?.position || 'Не указано'}</td>
                                                    <td>{application.vacancy?.company || 'Не указано'}</td>
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
                                                            month: 'short',
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

                                                            <button
                                                                className="btn-small grey"
                                                                onClick={() => navigate(`/vacancies/${application.vacancyId}`)}
                                                                disabled={loading}
                                                                title="Посмотреть вакансию"
                                                            >
                                                                <i className="material-icons">work</i>
                                                            </button>

                                                            {application.student?.resumeStatus === 'uploaded' && (
                                                                <button
                                                                    className="btn-small green"
                                                                    onClick={() => navigate(`/resume/${application.student?.studentId}`)}
                                                                    disabled={loading}
                                                                    title="Посмотреть резюме"
                                                                >
                                                                    <i className="material-icons">description</i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="center" style={{ marginTop: '30px' }}>
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>

                            <div className="row" style={{ marginTop: '20px' }}>
                                <div className="col s12">
                                    <div className="card-panel blue lighten-5">
                                        <h6>Статистика</h6>
                                        <div className="row">
                                            <div className="col s4">
                                                <strong>Всего заявок:</strong> {pagination.total}
                                            </div>
                                            <div className="col s4">
                                                <strong>Отправленные:</strong> {applications.filter(a => a.applicationStatus === 'posted').length}
                                            </div>
                                            <div className="col s4">
                                                <strong>Принятые:</strong> {applications.filter(a => a.applicationStatus === 'accepted').length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="center" style={{ padding: '40px 0' }}>
                            <div className="card-panel yellow lighten-4">
                                <i className="material-icons large" style={{ color: '#f57c00' }}>inbox</i>
                                <p style={{ fontSize: '1.2rem', margin: '20px 0', color: '#5d4037' }}>
                                    {statusFilter
                                        ? `Нет заявок со статусом "${getStatusBadge(statusFilter).text.toLowerCase()}"`
                                        : 'На ваши вакансии пока нет заявок'
                                    }
                                </p>
                                <p style={{ color: '#795548', marginBottom: '20px' }}>
                                    Когда студенты будут откликаться на ваши вакансии, заявки появятся здесь.
                                </p>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button
                                        className="btn waves-effect waves-light blue"
                                        onClick={() => navigate('/empvacancies')}
                                    >
                                        <i className="material-icons left">list</i>
                                        Мои вакансии
                                    </button>
                                    <button
                                        className="btn waves-effect waves-light green"
                                        onClick={() => navigate('/create')}
                                    >
                                        <i className="material-icons left">add</i>
                                        Создать вакансию
                                    </button>
                                    <button
                                        className="btn waves-effect waves-light orange"
                                        onClick={fetchApplications}
                                        disabled={loading}
                                    >
                                        <i className="material-icons left">refresh</i>
                                        Обновить
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
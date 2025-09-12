import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const RequestPage = () => {
    const { id } = useParams();
    const { request, loading } = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
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

    const fetchApplication = async () => {
        try {
            setIsLoading(true);
            const data = await request(
                `http://localhost:5000/api/applications/${id}`,
                'GET',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );
            setApplication(data.application);
        } catch (e) {
            console.error('Ошибка загрузки заявки:', e);
            message('Ошибка загрузки заявки');
            navigate('/my-applications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteApplication = async () => {
        if (!window.confirm('Вы уверены, что хотите отозвать заявку?')) {
            return;
        }

        try {
            await request(
                `http://localhost:5000/api/applications/${id}`,
                'DELETE',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );

            message('Заявка успешно отозвана');
            navigate('/my-applications');
        } catch (e) {
            message(e.message || 'Ошибка при отзыве заявки');
        }
    };

    useEffect(() => {
        if (!auth.token || auth.userStatus !== 'student') {
            navigate('/');
            return;
        }
        fetchApplication();
    }, [id, auth.token, auth.userStatus, navigate]);

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

    if (!application) {
        return (
            <div className="container center">
                <h5>Заявка не найдена</h5>
                <button
                    className="btn waves-effect waves-light blue"
                    onClick={() => navigate('/my-applications')}
                >
                    Вернуться к заявкам
                </button>
            </div>
        );
    }

    const status = getStatusBadge(application.applicationStatus);
    const canDelete = application.applicationStatus === 'posted';

    return (
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col s12">
                            <button
                                className="btn-flat waves-effect"
                                onClick={() => navigate('/my-applications')}
                            >
                                <i className="material-icons left">arrow_back</i>Назад к заявкам
                            </button>

                            <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>Информация о заявке</h4>
                                <span className={`badge ${status.class} white-text`}>
                                    {status.text}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 m6">
                            <div className="card-panel grey lighten-5">
                                <h6>Информация о заявке</h6>
                                <div>
                                    <p><strong>Дата подачи:</strong> {new Date(application.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                    <p><strong>Статус:</strong> <span className={`badge ${status.class}`}>{status.text}</span></p>
                                    <p><strong>ID заявки:</strong> {application.applicationId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col s12 m6">
                            <div className="card-panel grey lighten-5">
                                <h6>Контактная информация</h6>
                                {application.vacancy?.contactPerson && (
                                    <p><strong>Контактное лицо:</strong> {application.vacancy.contactPerson}</p>
                                )}
                                {application.vacancy?.contactEmail && (
                                    <p><strong>Email:</strong> {application.vacancy.contactEmail}</p>
                                )}
                                {application.vacancy?.contactPhone && (
                                    <p><strong>Телефон:</strong> {application.vacancy.contactPhone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <div className="card-panel grey lighten-5">
                                <h6>Информация о вакансии</h6>
                                <div className="row">
                                    <div className="col s6">
                                        <p><strong>Должность:</strong> {application.vacancy?.position || 'Не указано'}</p>
                                        <p><strong>Компания:</strong> {application.vacancy?.company || 'Не указано'}</p>
                                        <p><strong>Тип работы:</strong> {application.vacancy?.type || 'Не указано'}</p>
                                    </div>
                                    <div className="col s6">
                                        <p><strong>Зарплата:</strong> {application.vacancy ?
                                            formatSalary(application.vacancy.minSalary, application.vacancy.maxSalary)
                                            : 'Нет данных'
                                        }</p>
                                        <p><strong>Дата создания вакансии:</strong> {application.vacancy ?
                                            new Date(application.vacancy.createdAt).toLocaleDateString('ru-RU')
                                            : 'Не указано'
                                        }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {application.vacancy?.description && (
                        <div className="row">
                            <div className="col s12">
                                <div className="card-panel grey lighten-5">
                                    <h6>Описание вакансии</h6>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {application.vacancy.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <div className="col s12">
                            <button
                                className="btn waves-effect waves-light grey"
                                onClick={() => navigate('/stdrequests')}
                                disabled={loading}
                            >
                                {loading ? 'Назад...' : 'Назад к списку'}
                            </button>

                            {canDelete && (
                                <button
                                    className="btn waves-effect waves-light red"
                                    onClick={handleDeleteApplication}
                                    disabled={loading}
                                    style={{ marginLeft: '10px' }}
                                >
                                    {loading ? 'Отзыв...' : 'Отозвать заявку'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
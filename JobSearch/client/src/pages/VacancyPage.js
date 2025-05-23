import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const VacancyPage = () => {
    const { id } = useParams();
    const { loading, request, error, clearError } = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [vacancy, setVacancy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatSalary = (min, max) => {
        const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num);

        if (min === 0 && max === 0) return 'Не указана';
        if (min === 0) return `до ${formatNumber(max)} ₽`;
        if (max === 0) return `от ${formatNumber(min)} ₽`;
        return `${formatNumber(min)} - ${formatNumber(max)} ₽`;
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
        const fetchVacancy = async () => {
            try {
                const data = await request(
                    `http://localhost:5000/api/vacancies/${id}`,
                    'GET',
                    null,
                    { Authorization: `Bearer ${auth.token}` }
                );
                setVacancy(data);
            } catch (e) {
                console.error('Ошибка загрузки вакансии:', e);
            } finally {
                setIsLoading(false);
            }
        };

        if (auth.token) {
            fetchVacancy();
        }
    }, [id, request, auth.token]);

    useEffect(() => {
        if (error) {
            message(error);
            clearError();
        }
    }, [error, message, clearError]);

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

    if (!vacancy) {
        return (
            <div className="container center" style={{ padding: '40px 0' }}>
                <h5>Вакансия не найдена</h5>
                <button
                    className="btn waves-effect waves-light blue"
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '20px' }}
                >
                    Вернуться назад
                </button>
            </div>
        );
    }

    const status = getStatusBadge(vacancy.status);

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '1200px' }}>
            <div className="card">
                <div className="card-content">
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col s12">
                            <button
                                className="btn-flat waves-effect"
                                onClick={() => navigate(-1)}
                                style={{ marginBottom: '20px' }}
                            >
                                <i className="material-icons left">arrow_back</i>Назад
                            </button>

                            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>{vacancy.position}</h4>
                                <span className={`badge ${status.class}`}>{status.text}</span>
                            </div>

                            <h5 style={{ color: '#2196f3', marginTop: '10px' }}>{vacancy.company}</h5>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 m6">
                            <div className="card-panel grey lighten-5" style={{ padding: '20px' }}>
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Основная информация</h6>

                                <div style={{ marginBottom: '15px' }}>
                                    <p><strong>Тип работы:</strong> {vacancy.type}</p>
                                    <p><strong>Зарплата:</strong> {formatSalary(vacancy.minSalary, vacancy.maxSalary)}</p>
                                    <p><strong>Дата создания:</strong> {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col s12 m6">
                            <div className="card-panel grey lighten-5" style={{ padding: '20px' }}>
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Контактная информация</h6>
                                <p><strong>Контактное лицо:</strong> {vacancy.contactPerson || 'Не указано'}</p>
                                <p><strong>Email:</strong> {vacancy.contactEmail || 'Не указано'}</p>
                                <p><strong>Телефон:</strong> {vacancy.contactPhone || 'Не указано'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <div className="card-panel grey lighten-5" style={{ padding: '20px' }}>
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Описание вакансии</h6>
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {vacancy.description || 'Описание отсутствует'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col s12">
                            <button
                                className="btn waves-effect waves-light grey"
                                style={{ marginLeft: '10px' }}
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                {loading ? 'Закрыть...' : 'Закрыть'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
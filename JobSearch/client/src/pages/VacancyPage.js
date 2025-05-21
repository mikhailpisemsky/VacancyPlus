import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const VacancyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/vacancies/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }

                const data = await response.json();
                setVacancy(data);
            } catch (err) {
                console.error('Ошибка:', err);
                setError('Не удалось загрузить вакансию');
                navigate('/vacancies', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchVacancy();
    }, [id, navigate]);

    const handleEdit = () => {
        navigate(`/vacancies/${id}/edit`);
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'опубликована': 'green',
            'черновик': 'grey',
            'архив': 'red',
            'закрыта': 'orange'
        };

        return (
            <span className={`badge ${statusColors[status] || 'blue'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="center" style={{ height: '60vh' }}>
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

    if (error) {
        return (
            <div className="container center" style={{ padding: '24px' }}>
                <p>{error}</p>
                <button
                    className="btn waves-effect waves-light"
                    onClick={() => navigate('/vacancies')}
                >
                    Вернуться к списку вакансий
                </button>
            </div>
        );
    }

    if (!vacancy) return null;

    return (
        <div className="container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="card">
                <div className="card-content">
                    <div className="row" style={{ marginBottom: 0 }}>
                        <div className="col s10">
                            <span className="card-title">{vacancy.position}</span>
                        </div>
                        <div className="col s2 right-align">
                            <button
                                className="btn waves-effect waves-light"
                                onClick={handleEdit}
                                style={{ marginRight: '8px' }}
                            >
                                <i className="material-icons left">edit</i>
                                Редактировать
                            </button>
                            <button
                                className="btn waves-effect waves-light grey"
                                onClick={() => navigate(-1)}
                            >
                                <i className="material-icons left">arrow_back</i>
                                Назад
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <ul className="collection">
                                <li className="collection-item">
                                    <strong>Тип занятости:</strong> {vacancy.type}
                                </li>
                                <li className="collection-item">
                                    <strong>Статус:</strong> {getStatusBadge(vacancy.status)}
                                </li>
                                <li className="collection-item">
                                    <strong>Дата создания:</strong> {new Date(vacancy.created_at).toLocaleString()}
                                </li>
                                <li className="collection-item">
                                    <strong>Зарплата:</strong> {vacancy.salary || 'Не указана'}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <h5>Описание</h5>
                            <div className="card-panel grey lighten-5" style={{ whiteSpace: 'pre-line' }}>
                                {vacancy.description || 'Описание отсутствует'}
                            </div>
                        </div>
                    </div>

                    {vacancy.requirements && (
                        <div className="row">
                            <div className="col s12">
                                <h5>Требования</h5>
                                <div className="card-panel grey lighten-5" style={{ whiteSpace: 'pre-line' }}>
                                    {vacancy.requirements}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
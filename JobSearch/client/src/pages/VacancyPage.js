import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const VacancyPage = () => {
    const { id } = useParams();
    const { request, loading } = useHttp();
    const message = useMessage();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [vacancy, setVacancy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);

    const formatSalary = (min, max) => {
        const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num);

        if (min === 0 && max === 0) return 'Нет данных';
        if (min === 0) return `до ${formatNumber(max)} ₽`;
        if (max === 0) return `от ${formatNumber(min)} ₽`;
        return `от ${formatNumber(min)} до ${formatNumber(max)} ₽`;
    };

    const checkApplication = async () => {
        try {
            const data = await request(
                `http://localhost:5000/api/applications/check?vacancyId=${id}`,
                'GET',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );
            setHasApplied(data.hasApplied);
        } catch (e) {
            console.error('Application check error:', e);
        }
    };

    const fetchVacancy = async () => {
        try {
            setIsLoading(true);

            const headers = {};
            if (auth.token) {
                headers.Authorization = `Bearer ${auth.token}`;
            }

            const data = await request(`http://localhost:5000/api/vacancies/${id}`, 'GET', null, headers);
            setVacancy(data);

            if (auth.userStatus === 'student' && auth.token) {
                await checkApplication();
            }
        } catch (e) {
            console.error('Ошибка загрузки вакансии:', e);
            message('Ошибка загрузки вакансии');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        try {
            console.log('Начало отправки отклика...');
            console.log('Vacancy ID:', id);
            console.log('Token exists:', !!auth.token);

            await request(
                'http://localhost:5000/api/applications',
                'POST',
                { vacancyId: id },
                { Authorization: `Bearer ${auth.token}` }
            );
            message('Отклик успешно отправлен!');
            setHasApplied(true);
        } catch (e) {
            message(e.message || 'Ошибка при отправке отклика');
        }
    };

    const handleDelete = async () => {
        try {
            if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
                await request(
                    `http://localhost:5000/api/vacancies/${id}`,
                    'DELETE',
                    null,
                    { Authorization: `Bearer ${auth.token}` }
                );
                message('Вакансия успешно удалена');
                navigate('/empvacancies');
            }
        } catch (e) {
            message(e.message || 'Ошибка при удалении вакансии');
        }
    };

    useEffect(() => {
        fetchVacancy();
    }, [id, auth.token]);

    if (isLoading) {
        return <div className="center">Загрузка...</div>;
    }

    if (!vacancy) {
        return (
            <div className="container center">
                <h5>Вакансия не найдена</h5>
                <button
                    className="btn waves-effect waves-light blue"
                    onClick={() => navigate(-1)}
                >
                    Вернуться назад
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col s12">
                            <button
                                className="btn-flat waves-effect"
                                onClick={() => navigate(-1)}
                            >
                                <i className="material-icons left">arrow_back</i>Назад
                            </button>

                            <div className="flex-row">
                                <h4>{vacancy.position}</h4>
                            </div>

                            <h5>{vacancy.company}</h5>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 m6">
                            <div className="card-panel grey lighten-5">
                                <h6>Основная информация</h6>

                                <div>
                                    <p><strong>Уровень занятости:</strong> {vacancy.type}</p>
                                    <p><strong>Зарплата:</strong> {formatSalary(vacancy.minSalary, vacancy.maxSalary)}</p>
                                    <p><strong>Дата создания:</strong> {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col s12 m6">
                            <div className="card-panel grey lighten-5">
                                <h6>Контактная информация</h6>
                                <p><strong>Работодатель:</strong> {vacancy.contactPerson || 'Не указано'}</p>
                                <p><strong>Email:</strong> {vacancy.contactEmail || 'Не указано'}</p>
                                <p><strong>Телефон:</strong> {vacancy.contactPhone || 'Не указано'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <div className="card-panel grey lighten-5">
                                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Описание вакансии</h6>
                                <div>
                                    {vacancy.description || 'Описание отсутствует'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <button
                                className="btn waves-effect waves-light grey"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                {loading ? 'Закрыть...' : 'Закрыть'}
                            </button>
                        </div>
                    </div>
                    {auth.userStatus === 'student' && (
                        <div className="center">
                            <button
                                className={`btn waves-effect ${hasApplied ? 'grey' : 'green'}`}
                                onClick={handleApply}
                                disabled={hasApplied || loading}
                            >
                                {hasApplied
                                    ? 'Отклик отправлен'
                                    : (loading ? 'Отправка...' : 'Откликнуться на вакансию')}
                            </button>
                        </div>
                    )}
                    {auth.userStatus === 'employer' && (
                        <div className="center">
                            <button
                                className="btn waves-effect waves-light red"
                                onClick={handleDelete}
                                disabled={loading}
                                style={{ marginLeft: '10px' }}
                            >
                                {loading ? 'Удаление...' : 'Удалить вакансию'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
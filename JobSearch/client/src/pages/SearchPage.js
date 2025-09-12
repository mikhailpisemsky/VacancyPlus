import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { Pagination } from '../components/Pagination';

export const SearchPage = () => {
    const { request } = useHttp();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [vacancies, setVacancies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchVacancies = async () => {
        try {
            setIsLoading(true);
            const data = await request('http://localhost:5000/api/search', 'GET', null,
                { Authorization: `Bearer ${auth.token}` });
            setVacancies(data);
        } catch (e) {
            console.error('Error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies();
    }, []);

    if (isLoading) {
        return <div className="center">Загрузка вакансий...</div>;
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <h4>Доступные вакансии</h4>

                    {vacancies.length > 0 ? (
                        <>
                            <table className="highlight">
                                <thead>
                                    <tr>
                                        <th>Должность</th>
                                        <th>Компания</th>
                                        <th>Дата публикации</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vacancies.map(vacancy => (
                                        <tr key={vacancy.id}>
                                            <td>{vacancy.position}</td>
                                            <td>{vacancy.company}</td>
                                            <td>
                                                {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn blue"
                                                    onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                                                >
                                                    Подробнее
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={fetchVacancies}
                            />
                        </>
                    ) : (
                        <p className="center">Нет доступных вакансий</p>
                    )}
                </div>
            </div>
        </div>
    );
};
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './MainPage.css';

export const MainPage = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const userStatus = auth.userStatus;

    const handleSearchVacancies = () => {
        navigate('/search');
    };

    const handleCreateVacancy = () => {
        navigate('/create');
    };

    return (
        <div className="main-page">
            <div className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Вакансия+
                        </h1>
                        <p className="hero-subtitle">
                            Сервис по поиску временной работы, стажировок
                        </p>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="container">
                    <div className="user-welcome">
                        <div className="welcome-card">
                            <div className="card-content">
                                <h3 className="welcome-title">
                                    Добро пожаловать!
                                </h3>

                                {userStatus === 'student' ? (
                                    <>
                                        <h4 className="center">Вакансия+ для студентов:</h4>
                                        <div className="welcome-content">
                                            <div className="welcome-icon">
                                                <i className="material-icons large">search</i>
                                            </div>
                                            <div className="welcome-text">
                                                <p>Начни поиск подходящих вакансий</p>
                                                <p>Откликайся на интересные предложения</p>
                                                <p>Отслеживай статус своих заявок</p>
                                            </div>
                                        </div>
                                        <div className="welcome-actions">
                                            <button
                                                className="btn-large waves-effect waves-light blue"
                                                onClick={handleSearchVacancies}
                                            >
                                                <i className="material-icons left">search</i>
                                                Поиск вакансий
                                            </button>
                                            <button
                                                className="btn-large waves-effect waves-light grey"
                                                onClick={() => navigate('/stdrequests')}
                                                style={{ marginLeft: '15px' }}
                                            >
                                                <i className="material-icons left">list</i>
                                                Мои заявки
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                     <>
                                        <h4 className="center">Вакансия+ для работодателей:</h4>
                                        <div className="welcome-content">
                                            <div className="welcome-icon">
                                                <i className="material-icons large">add_circle</i>
                                            </div>
                                            <div className="welcome-text">
                                                <p>Создавайте новые вакансии</p>
                                                <p>Просматривайте отклики от кандидатов</p>
                                                <p>Управляйте своими вакансиями</p>
                                            </div>
                                        </div>
                                        <div className="welcome-actions">
                                            <button
                                                className="btn-large waves-effect waves-light green"
                                                onClick={handleCreateVacancy}
                                            >
                                                <i className="material-icons left">add</i>
                                                Создать вакансию
                                            </button>
                                            <button
                                                className="btn-large waves-effect waves-light blue"
                                                onClick={() => navigate('/empvacancies')}
                                                style={{ marginLeft: '15px' }}
                                            >
                                                <i className="material-icons left">list</i>
                                                Мои вакансии
                                            </button>
                                            <button
                                                className="btn-large waves-effect waves-light orange"
                                                onClick={() => navigate('/emprequests')}
                                                style={{ marginLeft: '15px' }}
                                            >
                                                <i className="material-icons left">description</i>
                                                Заявки
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>                        
                </div>
            </div>
        </div>
    );
};
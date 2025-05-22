import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';

export const CreateVacancyPage = () => {
    const message = useMessage();
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp();
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        vacancyType: '',
        positionName: '',
        companyName: '',
        min_salary: 0,
        max_salary: 0,
        vacancyDescription: ''
    });

    // Проверка авторизации при загрузке
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    // Инициализация Materialize select
    useEffect(() => {
        M.updateTextFields();
        const select = document.querySelectorAll('select');
        M.FormSelect.init(select);
    }, []);

    // Обработка ошибок авторизации
    useEffect(() => {
        if (error && (error === 'Нет авторизации' || error.includes('401'))) {
            logout();
            navigate('/');
        } else if (error) {
            message(error);
            clearError();
        }
    }, [error, message, clearError, logout, navigate]);

    // Обработчик изменения полей формы
    const changeHandler = event => {
        const value = event.target.type === 'number'
            ? event.target.valueAsNumber || ''
            : event.target.value;

        setForm({ ...form, [event.target.name]: value });
    };

    // Обработчик отправки формы
    const submitHandler = async () => {
        try {
            clearError();

            // Валидация перед отправкой
            if (!form.vacancyType || !form.companyName || !form.positionName || !form.vacancyDescription) {
                return M.toast({ html: 'Все поля обязательны для заполнения', classes: 'red' });
            }            

            if (form.min_salary && Number(form.min_salary) < 0) {
                return M.toast({ html: 'Минимальная зарплата должна быть положительным числом', classes: 'red' });
            }

            if (form.max_salary && Number(form.max_salary) < 0) {
                return M.toast({ html: 'Максимальная зарплата должна быть положительным числом', classes: 'red' });
            }

            if (form.min_salary && form.max_salary && Number(form.min_salary) > Number(form.max_salary)) {
                return M.toast({ html: 'Минимальная зарплата не может быть больше максимальной', classes: 'red' });
            }

            if (form.vacancyDescription.length < 10) {
                return M.toast({ html: 'Описание должно содержать минимум 10 символов', classes: 'red' });
            }

            const dataToSend = {
                ...form,
                min_salary: Number(form.min_salary),
                max_salary: Number(form.max_salary)
            };

            const data = await request('http://localhost:5000/api/vacancies/add', 'POST', dataToSend, {
                Authorization: `Bearer ${auth.token}`
            });

            M.toast({ html: 'Вакансия успешно создана!', classes: 'green' });
            setForm({
                vacancyType: '',
                positionName: '',
                companyName: '',
                min_salary: 0,
                max_salary: 0,
                vacancyDescription: ''
            });
            message(data.message);

        } catch (e) {
            console.error('Полный текст ошибки:', e);
        }
    };

    if (!token) {
        return null;
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title center-align">Создание вакансии</span>

                        <div className="row">
                            {/* Поле названия позиции */}
                            <div className="input-field col s12">
                                <input
                                    placeholder="Например: Системный аналитик"
                                    id="positionName"
                                    type="text"
                                    name="positionName"
                                    value={form.positionName}
                                    onChange={changeHandler}
                                    className="white-text"
                                />
                                <label htmlFor="positionName" className="white-text active">Название позиции</label>
                            </div>

                            <div className="input-field col s12">
                                <input
                                    placeholder="Укажите название компании"
                                    id="companyName"
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={changeHandler}
                                    className="white-text"
                                />
                                <label htmlFor="companyName" className="white-text active">Название компании</label>
                            </div>

                            <div className="input-field col s12">
                                <input
                                    placeholder="Укажите минимальную зарплату"
                                    id="min_salary"
                                    type="number"
                                    name="min_salary"
                                    value={form.min_salary}
                                    onChange={changeHandler}
                                    className="white-text"
                                />
                                <label htmlFor="min_salary" className="white-text active">Минимальная зарплата</label>
                            </div>

                            <div className="input-field col s12">
                                <input
                                    placeholder="Укажите максимальну зарплату"
                                    id="max_salary"
                                    type="number"
                                    name="max_salary"
                                    value={form.max_salary}
                                    onChange={changeHandler}
                                    className="white-text"
                                />
                                <label htmlFor="max_salary" className="white-text active">Максимальная зарплата</label>
                            </div>

                            {/* Поле описания вакансии */}
                            <div className="input-field col s12">
                                <textarea
                                    placeholder="Опишите обязанности, требования и условия работы"
                                    id="vacancyDescription"
                                    name="vacancyDescription"
                                    value={form.vacancyDescription}
                                    onChange={changeHandler}
                                    className="white-text materialize-textarea"
                                />
                                <label htmlFor="vacancyDescription" className="white-text active">Описание вакансии</label>
                            </div>

                            {/* Поле выбора типа вакансии */}
                            <div className="input-field col s12">
                                <select
                                    name="vacancyType"
                                    value={form.vacancyType}
                                    onChange={changeHandler}
                                    className="browser-default blue white-text"
                                >
                                    <option value="" disabled>Выберите тип вакансии</option>
                                    <option value="полная занятость">Полная занятость</option>
                                    <option value="частичная занятость">Частичная занятость</option>
                                    <option value="удалённая работа">Удалённая работа</option>
                                    <option value="ассистент преподавателя">Ассистент преподавателя</option>
                                    <option value="помощь в административных отделах">Административная помощь</option>
                                    <option value="участие в исследовательских проектах">Исследовательский проект</option>
                                    <option value="стажировка в партнёрских организациях">Стажировка</option>
                                </select>
                            </div>
                        </div>

                        <div className="card-action center-align">
                            <button
                                className="btn waves-effect waves-light"
                                onClick={submitHandler}
                                disabled={loading}
                            >
                                {loading ? 'Создание...' : 'Создать вакансию'}
                            </button>
                        </div>

                        {/* Отображение ошибок */}
                        {error && <div className="red-text center-align" style={{ marginTop: 20 }}>{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
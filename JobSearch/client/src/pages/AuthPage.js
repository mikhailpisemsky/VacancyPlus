import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        email: '', password: '', status: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('http://localhost:5000/api/auth/register', 'POST', { ...form })
            message(data.message)
        } catch (e) {
            console.error('Полный текст ошибки:', e);
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('http://localhost:5000/api/auth/login', 'POST', { ...form })
            auth.login(data.token, data.userId, data.userStatus)
        } catch (e) {
            console.error('Полный текст ошибки', e);
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center-align">Вакансия+</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title center-align">Регистрация</span>
                        <div className="row">
                            <div className="input-field yellow=input">
                                <input
                                    placeholder="Введите email"
                                    id="email" type="email"
                                    name="email"
                                    onChange={changeHandler}
                                    value={form.email}
                                    className="white-text" />
                                <label htmlFor="email" className="white-text active">Email</label>
                            </div>

                            <div className="input-field yellow=input">
                                <input
                                    placeholder="Введите пароль"
                                    id="password" type="password"
                                    name="password"
                                    onChange={changeHandler}
                                    value={form.password}
                                    className="white-text" />
                                <label htmlFor="password" className="white-text active">Пароль</label>
                            </div>

                            <div className="input-field">
                                <select
                                    id="status"
                                    name="status"
                                    onChange={changeHandler}
                                    value={form.status}
                                    className="browser-default blue white-text"
                                >
                                    <option value="" disabled selected>Укажите статус</option>
                                    <option value="student">Студент</option>
                                    <option value="employer">Работодатель</option>
                                </select>
                            </div>
                        </div>

                        <div className="card-action center-align">
                            <button className="btn white-text" onClick={loginHandler} style={{ marginRight: 10 }} disabled={loading}>{loading ? 'Авторизация...' : 'Войти'}</button>
                            <button className="btn white-text" onClick={registerHandler} disabled={loading}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</button>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    )
}
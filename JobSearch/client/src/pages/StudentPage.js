import React, { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const StudentPage = () => {
    const { loading, request, error, clearError } = useHttp()
    const message = useMessage()
    const auth = useContext(AuthContext)
    const [form, setForm] = useState({
        name: '', phone: ''
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

    const submitHandler = async () => {
        try {
            const data = await request('http://localhost:5000/api/information/student/setting', 'POST', { ...form }, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)

        } catch (e) {
            console.error('Полный текст ошибки', e);
        }
    }

    const fetchStudent = useCallback(async () => {
        try {
            const data = await request('http://localhost:5000/api/information/student', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            });
            if (data) {
                setForm({
                    name: data.name || '',
                    phone: data.phone || ''
                });
            }
        } catch (e) {
            message('Ошибка загрузки данных');
        }
    }, [request, auth.token, message]);

    useEffect(() => {
        fetchStudent();
    }, [fetchStudent]);

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h4 className="white-text">Мой профиль</h4>
                <div className="card blue darken-1 darken-1">
                    <div className="card-content white-text">
                        <div className="input-field">
                            <input
                                placeholder="Введите ФИО"
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={changeHandler}
                                className="white-text"
                            />
                            <label htmlFor="name" className="white-text active">ФИО</label>
                        </div>

                        <div className="input-field">
                            <input
                                placeholder="Укажите контактный телефон"
                                id="phone"
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={changeHandler}
                                className="white-text"
                            />
                            <label htmlFor="phone" className="white-text active">Телефон</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn waves-effect waves-light"
                            onClick={submitHandler}
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hock'
import { useMessage } from '../hooks/message.hock'

export const AuthPage = () => {
    const message = useMessage()
    const { loading, request, error, cleanError } = useHttp()
    const [form, setForm] = useState({
        email: '', password: '', name: '', phone: '', status: '' 
    })

    useEffect(() => {
        message(error)
        cleanError()
    }, [error, message, cleanError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', { ...form })
            console.log(data)
        } catch (e) {

        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center-align">Поиск стажировок</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title center-align">Авторизация</span>
                        <div className="row">
                            <div className="input-field">
                                <input id="email" type="email" name="email" onChange={changeHandler} />
                                <label htmlFor="email" className="black-text">Email</label>
                            </div>

                            <div className="input-field">
                                <input id="password" type="password" name="password" onChange={changeHandler} />
                                <label htmlFor="password" className="black-text">Password</label>
                            </div>

                            <div className="input-field">
                                <input id="name" type="text" name="name" onChange={changeHandler} />
                                <label htmlFor="name" className="black-text">Name</label>
                            </div>

                            <div className="input-field">
                                <input id="phone" type="tel" name="phone" onChange={changeHandler} />
                                <label htmlFor="phone" className="black-text">Phone</label>
                            </div>
                        </div>
                        <div className="input-field">
                            <select className="browser-default blue darken-1" id="status" name="status" onChange={changeHandler} >
                                <option value="default" disabled selected="selected">Status</option>
                                <option value="student">Студент</option>
                                <option value="employer">Работодатель</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-action center-align">
                        <button className="btn-flat" disabled={loading}>Войти</button>
                        <button className="btn-flat" onClick={registerHandler} disabled={loading}>Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
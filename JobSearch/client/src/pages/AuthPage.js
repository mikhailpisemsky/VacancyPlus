import React, { useState } from 'react'
import { useHttp } from '../hooks/http.hock'

export const AuthPage = () => {
    const { loading, request, error, cleanError } = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }


    const registerHandler = async () => {
        try {
            cleanError()
            const data = await request('/api/auth/register', 'POST', { ...form })
            console.log(data)
        } catch (e) {

        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center-align">Job search</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title center-align">Registration</span>
                        <div className="row">
                            <div className="input-field yellow=input">
                                <input id="email" type="email" name="email" onChange={changeHandler} className="white-text" />
                                <label htmlFor="email" className="white-text">Email</label>
                            </div>

                            <div className="input-field yellow=input">
                                <input id="password" type="password" name="password" onChange={changeHandler} className="white-text" />
                                <label htmlFor="password" className="white-text">Password</label>
                            </div>                            
                        </div>

                        <div className="row">
                            <div className="input-field center-align white-text">
                                <select className="browser-default blue white-text">
                                    <option className="white-text" value="" disabled selected>Choose your status</option>
                                    <option className="white-text" value="student">student</option>
                                    <option className="white-text" value="employer">employer</option>
                                </select>
                            </div>
                        </div>

                        <div className="card-action center-align">
                            <button className="btn white-text" style={{ marginRight: 10 }} disabled={loading}>Log in</button>
                            <button className="btn white-text" onClick={registerHandler} disabled={loading}>Sign up</button>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    )
}
import React from 'react'

export const AuthPage = () => {
    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Job search</h1>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span class="card-title">Авторизация</span>
                        <div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4">Войти</button>
                        <button className="btn grey lighten-1 black-text">Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
import React, { useContext } from 'react'
import { NavLink, useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const StudentNavbar = () => (
    <>
        <li><NavLink to="/stdrequests">Мои отклики</NavLink></li>
        <li><NavLink to="/student">Редактировать профиль</NavLink></li>
    </>
);

const EmployerNavbar = () => (
    <>
        <li><NavLink to="/empvacancies">Мои вакансии</NavLink></li>
        <li><NavLink to="/emprequests">Отклики на вакансии</NavLink></li>
        <li><NavLink to="/employer">Редактировать профиль</NavLink></li>
    </>
);

export const Navbar = () => {
    const navigate = useNavigate()
    const { logout, userStatus } = useContext(AuthContext);

    const logoutHandeler = event => {
        event.preventDefault()
        logout()
        navigate('/')
    }
    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <span className="brand-logo">Вакансия+</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/search">Поиск вакансий</NavLink></li>
                    {(userStatus === 'student') && <StudentNavbar />}
                    {(userStatus === 'employer') && <EmployerNavbar /> }
                    <li><a href="/" onClick={logoutHandeler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}
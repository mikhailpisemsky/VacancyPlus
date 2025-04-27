import React, { useContext } from 'react'
import { NavLink, useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Navbar = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)

    const logoutHandeler = event => {
        event.preventDefault()
        auth.logout()
        navigate('/')
    }
    return (
        <nav>
            <div class="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <span class="brand-logo">Job search</span>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li><NavLink to="/search">Search</NavLink></li>
                    <li><NavLink to="/vacancies">Vacancies</NavLink></li>
                    <li><a href="/" onClick={logoutHandeler}>Log out</a></li>
                </ul>
            </div>
        </nav>
    )
}
import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { StudentPage } from './pages/StudentPage'
import { EmployerPage } from './pages/EmployerPage'
import { StudentsRequestsPage } from './pages/StudentsRequestsPage'
import { EmployersVacanciesPage } from './pages/EmployersVacanciesPage'
import { VacancyPage } from './pages/VacancyPage'
import { EmployersRequestsPage } from './pages/EmployersRequestsPage'
import { RequestPage } from './pages/RequestPage'
import { SearchPage } from './pages/SearchPage'
import { AuthPage } from './pages/AuthPage'


export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/student" exact element={<StudentPage />} />
                <Route path="/employer" exact element={<EmployerPage />} />
                <Route path="/search" exact element={<SearchPage />} />
                <Route path="/stdrequests" element={<StudentsRequestsPage />} />
                <Route path="/emprequests" element={<EmployersRequestsPage />} />
                <Route path="/request/:id" element={<RequestPage />} />
                <Route path="/vacancy/:id" element={<VacancyPage />} />
                <Route path="/empvacancies" exact element={<EmployersVacanciesPage />} />                
                <Route path="*" element={<Navigate to="/search" />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path="/" exact element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />*/

        </Routes>
    )
}
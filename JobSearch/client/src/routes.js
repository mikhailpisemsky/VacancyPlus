import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { VacanciesPage } from './pages/VacanciesPage'
import { SearchPage } from './pages/SearchPage'
import { VacancyPage } from './pages/VacancyPage'
import { AuthPage } from './pages/AuthPage'
import { RequestsPage } from './pages/RequestsPage'


export const useRoutes = isAuthetificated => {
    if (isAuthetificated) {
        return (
            <Routes>
                <Route path="/vacancies" exact element={<VacanciesPage />} />
                <Route path="/search" exact element={<SearchPage />} />
                <Route path="/vacancy/:id" element={<VacancyPage />} />
                <Route path="/request/:id" element={<RequestsPage />} />
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
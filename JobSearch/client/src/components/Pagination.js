import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status') || '';

    // Ограничиваем количество отображаемых страниц
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const handlePageClick = (page) => {
        if (page !== currentPage) {
            onPageChange(page);
            navigate(`?status=${status}&page=${page}`);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <ul className="pagination">
            {/* Кнопка "Назад" */}
            <li className={`waves-effect ${currentPage === 1 ? 'disabled' : ''}`}>
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageClick(currentPage - 1);
                    }}
                >
                    <i className="material-icons">chevron_left</i>
                </a>
            </li>

            {/* Первая страница */}
            {startPage > 1 && (
                <>
                    <li className={currentPage === 1 ? 'active blue' : 'waves-effect'}>
                        <a href="#!" onClick={(e) => { e.preventDefault(); handlePageClick(1); }}>
                            1
                        </a>
                    </li>
                    {startPage > 2 && <li className="disabled"><a href="#!">...</a></li>}
                </>
            )}

            {/* Основные страницы */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const page = startPage + i;
                return (
                    <li key={page} className={currentPage === page ? 'active blue' : 'waves-effect'}>
                        <a href="#!" onClick={(e) => { e.preventDefault(); handlePageClick(page); }}>
                            {page}
                        </a>
                    </li>
                );
            })}

            {/* Последняя страница */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <li className="disabled"><a href="#!">...</a></li>}
                    <li className={currentPage === totalPages ? 'active blue' : 'waves-effect'}>
                        <a href="#!" onClick={(e) => { e.preventDefault(); handlePageClick(totalPages); }}>
                            {totalPages}
                        </a>
                    </li>
                </>
            )}

            {/* Кнопка "Вперед" */}
            <li className={`waves-effect ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageClick(currentPage + 1);
                    }}
                >
                    <i className="material-icons">chevron_right</i>
                </a>
            </li>
        </ul>
    );
};
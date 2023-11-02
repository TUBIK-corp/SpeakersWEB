import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { CookieHelper }  from './CookieHelper';

const Home = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cookieService = new CookieHelper();
        if (!cookieService.canAuthByCookie()) {
            // Если условие не выполняется, перенаправляем пользователя на другую страницу
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Получаем список таблиц с сервера при загрузке компонента
        const fetchTables = async () => {
            try {
                const response = await api.fetchData('/api/tables');
                setTables(response); // Устанавливаем список таблиц в состояние
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchTables();
    }, []); // Пустой массив второго аргумента означает, что эффект будет запускаться только при монтировании и размонтировании компонента

    useEffect(() => {
        // Получаем данные выбранной таблицы с сервера при изменении выбранной таблицы
        const fetchTableData = async () => {
            if (selectedTable) {
                try {
                    const response = await api.fetchData(`/api/tables/${selectedTable}`);
                    setTableData(response); // Устанавливаем данные таблицы в состояние
                } catch (error) {
                    console.error('Error fetching table data:', error);
                }
            }
        };

        fetchTableData();
    }, [selectedTable]); // Передаем selectedTable как зависимость, чтобы эффект запускался при изменении выбранной таблицы

    return (
        <div className="container mt-5">
            <h1>Выбор таблицы из базы данных</h1>
            <div className="form-group mt-3">
                <label>Выберите таблицу:</label>
                <select
                    className="form-control"
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                >
                    <option value="">Выберите таблицу</option>
                    {tables.map((table) => (
                        <option key={table.id} value={table.name}>
                            {table.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedTable && (
                <div className="mt-4">
                    <h2>Данные таблицы {selectedTable}:</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                {/* Заголовки таблицы */}
                                {Object.keys(tableData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Данные таблицы */}
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, index) => (
                                        <td key={index}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Home;
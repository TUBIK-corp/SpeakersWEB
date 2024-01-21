import React, { useState, useEffect } from 'react';
import api from './api';

const PlayBellsPage = () => {
    const [currentBell, setCurrentBell] = useState(null);

    useEffect(() => {
        const fetchCurrentBell = async () => {
            try {
                // Получаем все звонки
                const allBells = await api.getBells();

                // Фильтруем звонки, чтобы получить текущий звонок
                const currentTime = new Date().getTime();
                const filteredBells = allBells.filter(
                    (bell) => new Date(bell.time).getTime() <= currentTime
                );

                if (filteredBells.length > 0) {
                    setCurrentBell(filteredBells[0]);
                } else {
                    setCurrentBell(null);
                }
            } catch (error) {
                console.error('Failed to fetch current bell:', error);
            }
        };

        // Вызываем функцию fetchCurrentBell при монтировании компонента
        fetchCurrentBell();

        // Устанавливаем интервал для периодического обновления текущего звонка
        const intervalId = setInterval(fetchCurrentBell, 1000); // каждые 10 секунд (или любой другой интервал)

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []);

    // Функция для воспроизведения звонка
    const playBell = async () => {
        try {
            // Запускаем текущий звонок (например, используя аудио API)
            if (currentBell) {
                const audio = new Audio(currentBell.audioFileLocation);
                audio.play();
            }
        } catch (error) {
            console.error('Failed to play bell:', error);
        }
    };

    // Проверяем, наступило ли время для воспроизведения звонка
    useEffect(() => {
        if (currentBell) {
            const currentTime = new Date().getTime();
            const bellTime = new Date(currentBell.time).getTime();

            // Если текущее время больше времени начала звонка, запускаем его воспроизведение
            if (currentTime >= bellTime) {
                playBell();
            }
        }
    }, [currentBell]);

    return (
        <div>
            <h1>Страница для воспроизведения звонков</h1>
            {currentBell ? (
                <div>
                    <h2>Текущий звонок:</h2>
                    <p>{`Время: ${currentBell.time}, Длительность: ${currentBell.duration}, Выложил: ${currentBell.uploaderName}, Id: ${currentBell.id}`}</p>
                    <button onClick={playBell}>Воспроизвести звонок</button>
                </div>
            ) : (
                <p>Нет текущего звонка.</p>
            )}
        </div>
    );
};

export default PlayBellsPage;
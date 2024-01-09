import React, { useState, useEffect, useRef } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { CookieHelper } from './CookieHelper';

const Home = () => {
    const [bells, setBells] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const bellsContainerRef = useRef(null);
    const perPage = 10;
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [newBell, setNewBell] = useState({
        time: '',
        audioFilePath: '',
        uploaderName: localStorage.getItem('username'),
        duration: '',
        isUpcoming: false
    });

    useEffect(() => {
        const cookieService = new CookieHelper();
        if (!cookieService.canAuthByCookie()) {
            localStorage.setItem('username', null);
            navigate('/login');
        } else {
            fetchBellsData();
        }
    }, [navigate]);

    useEffect(() => {
        scrollToUpcoming();
    }, [bells]);

    const fetchBellsData = async () => {
        try {
            const response = await api.fetchData('/api/bells');
            setBells(response);
            setCurrentPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error('Failed to fetch bell data:', error);
        }
    };

    const formatTime = (time) => {
        return new Intl.DateTimeFormat('ru-RU', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }).format(new Date(time));
    };

    const scrollToUpcoming = () => {
        if (bellsContainerRef.current) {
            const upcomingBell = bells.find((bell) => bell.isUpcoming);
            if (upcomingBell) {
                const upcomingBellElement = document.getElementById(`bell-${upcomingBell.id}`);
                if (upcomingBellElement) {
                    upcomingBellElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    const handleAudioFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);

            audio.addEventListener('loadedmetadata', () => {
                const durationInSeconds = Math.ceil(audio.duration);
                setNewBell({
                    ...newBell,
                    duration: secondsToTimeSpan(durationInSeconds),
                });
                setAudioFile(file);
            });
        }
    };

    const handleCreateBell = async () => {
        try {
            const createdBell = await api.createBell(newBell, audioFile);
            setNewBell({
                time: '',
                audioFilePath: '',
                uploaderName: localStorage.getItem('username'),
                duration: '',
                isUpcoming: false
            });
            setSelectedFile(null);
            fetchBellsData();
        } catch (error) {
            console.error('Failed to create bell:', error);
        }
    };

    const secondsToTimeSpan = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="home-container">
            <div className="bells-container">
                <h1 className="title">Расписание звонков</h1>
                <ul className="bells-list" ref={bellsContainerRef}>
                    {bells.map((bell) => (
                        <li
                            key={bell.id}
                            id={`bell-${bell.id}`}
                            className={bell.isUpcoming ? 'upcoming-bell' : 'past-bell'}
                        >
                            <span className="bell-info">
                                Время: {formatTime(bell.time)}, Длительность: {bell.duration}, Выложил: {bell.uploaderName}
                            </span>
                            <audio controls>
                                <source src={bell.audioFilePath} type="audio/mp3" />
                                Ваш браузер не поддерживает аудио-элемент.
                            </audio>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="create-bell-container">
                <h1 className="title">Создать новый звонок</h1>
                <form>
                    <div className="form-group">
                        <label>Время:</label>
                        <input type="datetime-local" value={newBell.time} onChange={(e) => setNewBell({ ...newBell, time: e.target.value })} step="1" />
                    </div>
                    <div className="form-group">
                        <label>Аудиофайл:</label>
                        <label className="custom-file-upload">
                            {selectedFile ? selectedFile.name : 'Выбрать файл'}
                            <input type="file" onChange={handleAudioFileChange} accept="audio/*" />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Выложил:</label>
                        <input type="text" value={newBell.uploaderName} disabled />
                    </div>
                    <div className="form-group">
                        <label>Длительность:</label>
                        <input type="text" value={newBell.duration} disabled />
                    </div>
                    <button type="button" onClick={handleCreateBell}>Создать звонок</button>
                </form>
            </div>
        </div>
    );
};

export default Home;

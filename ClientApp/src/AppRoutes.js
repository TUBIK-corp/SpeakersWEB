import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import PlayBellsPage from './components/PlayBellsPage';

const AppRoutes = [
    {
        index: true,
        element: <Home/>
    },
    {
        path: '/login/',
        element: <LoginPage/>
    },
    {
        path: '/player/',
        element: <PlayBellsPage />,
    }
];

export default AppRoutes;

import LoginPage from "./components/LoginPage";
import Home from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: '/login/',
    element: <LoginPage/>
  }
];

export default AppRoutes;

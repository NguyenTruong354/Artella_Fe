import { createBrowserRouter } from 'react-router-dom';
import HelloWorld from '../pages/HelloWorld';
import Home from '../pages/Landing';
import Login from '../pages/Login';
import MainLayout from '../layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/hello',
        element: <HelloWorld />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);

export default router;

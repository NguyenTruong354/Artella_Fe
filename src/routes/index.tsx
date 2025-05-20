import { createBrowserRouter } from 'react-router-dom';
import HelloWorld from '../pages/HelloWorld';
import Home from '../pages/Landing';
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
    ],
  },
]);

export default router;

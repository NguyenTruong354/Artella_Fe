import { createBrowserRouter } from 'react-router-dom';
import HomeSection from '../components/Home/HomeSection';
import Landing from '../pages/Landing';
import Gallery from '../pages/Gallery';
import Auctions from '../pages/Auctions';
import Collections from '../pages/Collections';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import HomeLayout from '../layouts/HomeLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomeSection />,
      },
      {
        path: '/gallery',
        element: <Gallery />,
      },
      {
        path: '/auctions',
        element: <Auctions />,
      },
      {
        path: '/collections',
        element: <Collections />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/landing',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;

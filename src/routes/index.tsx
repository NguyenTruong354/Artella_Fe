import { createBrowserRouter } from 'react-router-dom';
import HomeSection from '../components/Home/HomeSection';
import Landing from '../pages/Landing';
import Gallery from '../pages/Gallery';
import Auctions from '../pages/Auctions';
import AuctionParticipation from '../pages/AuctionParticipation';
import Collections from '../pages/Collections';
import Profile from '../pages/Profile';
import CreateNFT from '../pages/CreateNFT';
import DetailNFT from '../pages/DetailNFT';
import ExploreMore from '../pages/ExploreMore';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import HomeLayout from '../layouts/HomeLayout';

const HtmlPage = () => {
  return <iframe src="/SendMyLove.html" width="100%" height="650px" style={{ border: "none" }}></iframe>;
};

const router = createBrowserRouter([  {
    path: '/Home',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomeSection />,
      },      {
        path: 'gallery',
        element: <Gallery />,
      },
      {
        path: 'nft/:id',
        element: <DetailNFT />,
      },{
        path: 'auctions',
        element: <Auctions />,
      },
      {
        path: 'auction/1',
        element: <AuctionParticipation />,
      },
      {
        path: 'collections',
        element: <Collections />,
      },      {
        path: 'profile',
        element: <Profile />,
      },      {
        path: 'create-nft',
        element: <CreateNFT />,
      },
      {
        path: 'explore-more',
        element: <ExploreMore />,
      },
    ],
  },
  {
    path: '/',
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
    path: '/MinhAnh/SendMyLove',
    element: <HtmlPage/>,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;

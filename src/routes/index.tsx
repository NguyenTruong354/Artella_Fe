import { createBrowserRouter } from "react-router-dom";
import HomeSection from "../components/Home/HomeSection";
import Landing from "../pages/Landing";
import Gallery from "../pages/Gallery";
import Auctions from "../pages/Auctions";
import AuctionParticipation from "../pages/AuctionParticipation";
import Collections from "../pages/Collections";
import Profile from "../pages/Profile";
import CreateNFT from "../pages/CreateNFT";
import DetailNFT from "../pages/DetailNFT";
import ExploreMore from "../pages/ExploreMore";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Verification from "../pages/Verification";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../pages/NotFound";
import HtmlPage from "../pages/HtmlPage";
import MainLayout from "../layouts/MainLayout";
import HomeLayout from "../layouts/HomeLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/Home",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeSection />,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
      {
        path: "nft/:id",
        element: <DetailNFT />,
      },
      {
        path: "auctions",
        element: <Auctions />,
      },
      {
        path: "auction/1",
        element: <AuctionParticipation />,
      },
      {
        path: "collections",
        element: <Collections />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "create-nft",
        element: <CreateNFT />,
      },
      {
        path: "explore-more",
        element: <ExploreMore />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoute requireAuth={false}>
        <Signup />
      </ProtectedRoute>
    ),
  },  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute requireAuth={false}>
        <ForgotPassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ProtectedRoute requireAuth={false}>
        <ResetPassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verification",
    element: <Verification />,
  },
  {
    path: "/MinhAnh/SendMyLove",
    element: <HtmlPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

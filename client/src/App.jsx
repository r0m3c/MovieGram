import React from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import { AuthContextProvider } from './context/authContext';
import Reviews from './Pages/Reviews';
import Lists from './Pages/Lists';
import Movies from './Pages/Movies';
import Movie from './Pages/Movie';
import EditMovie from './Pages/EditMovie';
import Profile from './Pages/Profile';
import EditProfile from './Pages/EditProfile';
import EditComment from './Pages/EditComment';
import MoviesDetail from './Pages/MoviesDetail';
import MovieNews from './Pages/MovieNews';
import Navbar from './Pages/Navbar';
import Footer from './Pages/Footer';
import ReportPost from './Pages/ReportPost';
import Feedback from './Pages/Feedback';
import WatchList from './Pages/WatchList';
import WatchlistAdd from './Pages/WatchlistAdd';
import EditWatchlist from './Pages/EditWatchlist';


function App() {
  const Layout = () => {
    return (
      <>
        {/* <Navbar style={{ paddingLeft: "8%", paddingRight: "8%" }}/>
        <Outlet style={{ paddingLeft: "8%", paddingRight: "8%" }}/>
        <Footer/> */}
        {/* <Navbar /> */}
        <div style={{ paddingLeft: "8%", paddingRight: "8%" }}>
          <Navbar />
          <Outlet />
        </div>
        <Footer />
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <Home/>,
        },
        {
          path: "/reviews",
          element: <Reviews/>,
        },
        {
          path: "/lists",
          element: <Lists/>,
        },
        {
          path: "/movies",
          element: <Movies/>,
        },
        {
          path: "/movie",
          element: <Movie/>,
        },
        {
          path: "/edit_movie/:movieId",
          element: <EditMovie/>,
        },
        {
          path: "/profile/:id",
          element: <Profile/>,
        },
        {
          path: "/edit_profile/:id",
          element: <EditProfile/>,
        },
        {
          path: "/edit_comment/:id",
          element: <EditComment/>,
        },
        {
          path: "/movie/api/:id",
          element: <MoviesDetail/>,
        },
        {
          path: "/movie/news",
          element: <MovieNews/>,
        },
        {
          path: "/report/post/:id",
          element: <ReportPost/>,
        },
        {
          path: "/feedback",
          element: <Feedback/>,
        },
        {
          path: "/watchlist",
          element: <WatchList/>,
        },
        {
          path: "/watchlist/add",
          element: <WatchlistAdd/>,
        },
        {
          path: "/edit_watchlist/:id",
          element: <EditWatchlist/>,
        },
      ]
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  )
}

export default App

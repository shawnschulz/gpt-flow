import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import ErrorPage from './ErrorPage.tsx'
import AboutPage from './routes/about.tsx'
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, 
        errorElement: <ErrorPage />,
    },
    {
        path: "/about",
        element: <AboutPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)

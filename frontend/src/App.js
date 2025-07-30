import './App.css';
import { useState } from 'react';

// pages
import Home from './pages/home/index';
import Blog from './pages/blog';
import ContactUs from './pages/contact-us';
import NotFound from './pages/not-found';
import Output from './pages/output';
import OutputComponents from './dummy-pages/output-components';
import WebsiteScan from './pages/websiteScan';


// REACT ROUTER
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {path: '/', element: <Home/>},
  {path:'/blog', element: <Blog/>},
  {path:'/contact-us', element: <ContactUs/>},
  {path:'/:websiteScan', element: <WebsiteScan />, children:[ 
    {path: 'results', element: <WebsiteScan />, children: [
      {path:'', element: <WebsiteScan />},
      {path:':outputTab', element: <WebsiteScan />},
      {path:':outputTab/:htmlElement', element: <WebsiteScan />},
    ]},
  ]},
  {path:'/output-components', element: <OutputComponents/>},
  {path:'/*', element: <NotFound/>},
]);

function App() {
  const {RESULTS, setRESULTS} = useState({});

  return (
    <div className='background-gradient h-screen'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

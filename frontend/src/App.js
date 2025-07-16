import './App.css';
import Home from './pages/home/index';
import Blog from './pages/blog';
import ContactUs from './pages/contact-us';
import NotFound from './pages/not-found';
import Output from './pages/output';

// REACT ROUTER
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {path: '/', element: <Home/>},
  {path:'/blog', element: <Blog/>},
  {path:'/contact-us', element: <ContactUs/>},
  {path:'/output', element: <Output/>},
  {path:'/*', element: <NotFound/>},
]);

function App() {
  return (
    <div className='background-gradient h-screen'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

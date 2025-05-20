import { createBrowserRouter } from 'react-router-dom';
import HelloWorld from '../pages/HelloWorld';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HelloWorld />,
  },
]);

export default router;

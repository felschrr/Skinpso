import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { Home, Inventory } from './pages';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();

  return user ? element : <Navigate to="/" />;
};

const App = () => {
  const routes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/inventory',
          element: <PrivateRoute element={<Inventory/>} />,
        },
      ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    }
  ];

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children &&
                route.children.map((child, childIndex) => (
                  <Route key={childIndex} index={child.index} path={child.path} element={child.element} />
                ))}
            </Route>
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

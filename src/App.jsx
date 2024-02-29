import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Layout } from "./components";
import { Home, Inventory, Account, User } from "./pages";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SocialProvider } from "./context/SocialContext.jsx";

const PrivateRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/" />;
};

const App = () => {
    const routes = [
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: "/inventory",
                    element: <PrivateRoute element={<Inventory />} />,
                },
                {
                    path: "/account",
                    element: <PrivateRoute element={<Account />} />,
                },
                {
                    path: "/user/:userId",
                    element: <PrivateRoute element={<User />} />,
                },
            ],
        },
        {
            path: "*",
            element: <Navigate to="/" replace />,
        },
    ];

    return (
        <AuthProvider>
            <UserProvider>
                <SocialProvider>
                    <ThemeProvider>
                        <InventoryProvider>
                            <Router>
                                <Routes>
                                    {routes.map((route, index) => (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            element={route.element}
                                        >
                                            {route.children &&
                                                route.children.map(
                                                    (child, childIndex) => (
                                                        <Route
                                                            key={childIndex}
                                                            index={child.index}
                                                            path={child.path}
                                                            element={
                                                                child.element
                                                            }
                                                        />
                                                    )
                                                )}
                                        </Route>
                                    ))}
                                </Routes>
                            </Router>
                        </InventoryProvider>
                    </ThemeProvider>
                </SocialProvider>
            </UserProvider>
        </AuthProvider>
    );
};

export default App;

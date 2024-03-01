import { Outlet } from "react-router-dom";
import { Header, Footer } from "./";
import { ToastContainer } from "react-toastify";

const Layout = () => (
    <div className="dark:bg-gray-800">
        <Header />
        <main className="min-h-[75vh]">
            <Outlet />
        </main>
        <Footer />
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="colored"
            limit={3}
        />
    </div>
);

export default Layout;

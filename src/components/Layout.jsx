import {Outlet} from 'react-router-dom';
import { Header, Footer } from './'
import { ToastContainer } from 'react-toastify';

const Layout = () => (
    <div className="dark:bg-gray-800">
        <Header/>
        <main >
            <Outlet/>
        </main>
        <Footer/>
        <ToastContainer />
    </div>
);

export default Layout;
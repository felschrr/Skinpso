import {Outlet} from 'react-router-dom';
import { Header, Footer } from './'
import { ToastContainer } from 'react-toastify';

const Layout = () => (
    <div className=''>
        <Header/>
        <main className="dark:bg-gray-800">
            <Outlet/>
        </main>
        <Footer/>
        <ToastContainer />
    </div>
);

export default Layout;
import {Outlet} from 'react-router-dom';
import { Header, Footer } from './'
const Layout = () => (
    <div>
        <Header/>
            <Outlet/>
        <Footer/>
    </div>
);

export default Layout;
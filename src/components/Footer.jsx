import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t-[1px] border-gray-200 dark:border-t-[0px] mt-16 py-4 dark:bg-gray-700 dark:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                    <p className="text-gray-800 dark:text-white">© 2024 Skinpso. All rights reserved.</p>
                </div>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:text-gray-300 text-gray-800 dark:text-white">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-300 text-gray-800 dark:text-white">About</Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-gray-300 text-gray-800 dark:text-white">Contact</Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;

import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex justify-center align-middle dark:bg-gray-800 dark:text-white">
            <section className="w-2/3 py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                        <img
                            alt="CS2 Skins"
                            className="object-cover object-center mx-auto overflow-hidden aspect-video rounded-xl sm:w-full lg:order-last"
                            height="310"
                            src="https://placehold.co/600x400"
                            width="550"
                        />
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl dark:text-white">
                                    Store and Track Your CS2 Skins Investments
                                </h1>
                                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Manage and monitor your CS2 skins collection
                                    to stay on top of your gaming assets.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link
                                    className="inline-flex items-center justify-center h-10 px-8 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md shadow hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    to="#"
                                >
                                    Browse Skins
                                </Link>
                                <Link
                                    className="inline-flex items-center justify-center h-10 px-8 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    to="#"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

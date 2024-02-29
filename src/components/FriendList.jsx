import { useSocial } from "../context/SocialContext.jsx";
import { Link } from "react-router-dom";

const FriendList = () => {
    const { contacts, removeContact } = useSocial();

    return (
        <div className="max-w-md p-6 mx-auto mt-8 bg-white border border-gray-200 rounded-md shadow-md dark:border-gray-600 dark:bg-gray-800">
            <div className="Friends">
                <h2 className="mb-2 text-xl font-bold dark:text-white">
                    Liste d'amis
                </h2>
                {contacts.map((contact, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between mb-2"
                    >
                        <Link
                            to={`/user/${contact.uid}`}
                            className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                            <img
                                src={contact.photoURL}
                                className="w-8 h-8 mr-2 rounded"
                                alt={
                                    "Photo de profil de " + contact.displayName
                                }
                            />
                            <span>{contact.displayName}</span>
                        </Link>
                        <button
                            onClick={() => removeContact(contact)}
                            className="px-3 py-1 text-white bg-red-500 rounded"
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;

import React from "react";
import { useParams } from "react-router-dom";

const User = () => {
    const { userId } = useParams();

    return (
        <div>
            <h2>Contact</h2>
            <p>Username: {userId}</p>
        </div>
    );
};

export default User;

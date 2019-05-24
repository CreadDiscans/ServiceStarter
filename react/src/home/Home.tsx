import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h2>
                홈
            </h2>
            <div><Link to="/about">about</Link></div>
            <div><Link to="/users">users</Link></div>
        </div>
    );
};

export default Home;
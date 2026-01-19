import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar';
import React from 'react';

export default function App() {
    return (
        <div>
            <AppNavbar/>
            <div className="container-fluid main-content">
                <Outlet />
            </div>
        </div>
    );
}

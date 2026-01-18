import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar';
import { fetchDeckMetadata } from '../slices/decksSlice';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { AppDispatch } from '../main';

export default function App() {
    const dispatch: AppDispatch = useDispatch();
    //const params = useParams<AppParams>();

    useEffect(() => {
        dispatch(fetchDeckMetadata());
    }, [dispatch]);

    return (
        <div>
            <AppNavbar/>
            <div className="container-fluid main-content">
                <Outlet />
            </div>
        </div>
    );
}

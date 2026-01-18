import { Outlet, useParams } from 'react-router-dom';
import AppNavbar from './Navbar';
import { fetchDeckMetadata } from '../slices/decksSlice';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';

export default function App() {
    const dispatch = useDispatch();
    const params = useParams();

    const deckId = params.deck; // Accessing the 'deck' parameter

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

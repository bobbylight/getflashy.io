import { Outlet } from 'react-router-dom';
import { AppNavbar } from './Navbar';

export function App() {
    return (
        <div>
            <AppNavbar/>
            <div className="container-fluid main-content">
                <Outlet />
            </div>
        </div>
    );
}

import { createRoot } from 'react-dom/client';
import App from './components/App';
import App404 from './components/App404';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeckList from './components/DeckList';
import DeckConfig from './components/DeckConfig';
import Deck from './components/Deck';
import Results from './components/Results';

import 'bootswatch/dist/flatly/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './css/app.css';
import { DecksProvider } from './contexts/DecksContext';

const container = document.getElementById('app-content');
if (!container) {
  throw new Error('Failed to find the root element with id "app-content"');
}
const root = createRoot(container);

root.render(
    <DecksProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<DeckList />} />
                    <Route path="/config/:deckId" element={<DeckConfig />} />
                    <Route path="/decks/:deckId" element={<Deck />} />
                    <Route path="/results/:deckId" element={<Results />} />
                    <Route path='*' element={<App404 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </DecksProvider>
);

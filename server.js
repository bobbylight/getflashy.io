import express from 'express';
import compression from 'compression';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(compression());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const decks = {};
const deckDir = path.join(__dirname, 'public/decks');
const files = fs.readdirSync(deckDir);

for (const file of files) {
    const id = file.substring(0, file.lastIndexOf('.'));
    const module = await import(path.join(deckDir, id) + '.js');
    decks[id] = module.default; // Load deck data as-is, append "metadata" fields below
    decks[id].id = id;
    decks[id].modified = fs.statSync(path.join(deckDir, file)).mtime;
}

console.log('Decks:', Object.keys(decks));
console.log();

const createDeckMetadata = (decks) => {

    const metadata = {};

    for (let deckId in decks) {
        let deck = decks[deckId];
        metadata[deckId] = {
            name: deck.name,
            icon: deck.icon,
            id: deck.id,
            modified: deck.modified,
            size: deck.cards.length
        };
    }

    return metadata;
};

app.get('/api/decks', (req, res) => {
    res.type('application/json');
    res.json(createDeckMetadata(decks));
});

app.get('/api/decks/:deckId', (req, res) => {

    res.type('application/json');

    let deck = decks[req.params.deckId];
    if (deck) {
        res.json(deck);
    }
    else {
        res.statusCode = 404;
        res.json({ error: 'Deck not found: ' + req.params.deckId });
    }
});

app.use(express.static(path.join(__dirname, 'build')));

// Single-page app; always route to index.html for non-static content URLs
app.get('*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(process.env.PORT || 8080);

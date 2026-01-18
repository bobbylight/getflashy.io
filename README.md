# getflashy - Source code for getflashy.io
`getflashy` is a flash card webapp.  I'm building it to learn
trendy new web technologies while memorizing a bunch of words.

## Hacking
`getflashy` is written in React using ES6 classes.  It's built
with vite, which makes developing super-easy.  First, install
all node modules and start an express server (port 8080 by default;
configurable via $PORT environment variable):

```js
npm install
npm run start
```

Then, in another window, build and watch the UI components in
dev mode so changes are immediately visible in your browser
after a refresh:

```js
npm run watch
```

### How it works
vite is building a minified version of the app in `build/`.  Our
express server is serving that static content, as well as providing
a simple REST API to fetch flashcard decks.

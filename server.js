import fs from 'fs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import rateLimit from 'express-rate-limit';
import LRU from 'lru-cache';

const require = createRequire(import.meta.url);
const config = require('./config.json');
const { port, DataDirectory, adress, windowMs, MaximumRequests, RatelimitMessage, fileCreationCacheMax, fileCreationCacheMaxAge, HosterName, MinChar } = config;
/**Prevents a very common issue.*/
if (port < 1024) {
	console.log("Warning: You are attempting to use a privileged port. If you encounter an error, please try running the command with elevated permissions (as root).")
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    windowMs: windowMs,
    max: MaximumRequests,
    message: RatelimitMessage,
});
app.use('/create-file', limiter); 

const fileCreationCache = new LRU({
    max: fileCreationCacheMax, 
    maxAge: fileCreationCacheMaxAge,
});

/**
 * Route to send HosterName to the client
 */
app.get('/hoster-name', (req, res) => {
    res.json({ HosterName });
});

/**
 * Route to send MinChar to the client
 */
app.get('/min-char', (req, res) => {
    res.json({ MinChar });
});


/**
 * Route to handle saving content based on a token.
 */
app.post('/create-file', (req, res) => {
    const { save: data, token } = req.body;

    const now = Date.now();
    const userFileData = fileCreationCache.get(req.ip) || { count: 0, lastRequest: now };

    if (now - userFileData.lastRequest > 60 * 1000) {
        userFileData.count = 0;
        userFileData.lastRequest = now;
    }

    if (userFileData.count >= 5) {
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    userFileData.count++;
    fileCreationCache.set(req.ip, userFileData);

    const filePath = path.join(DataDirectory, `${token}.txt`);
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error saving file' });
        } else {
            res.status(200).json({ message: 'File saved successfully' });
        }
    });
});

/**
 * Route to handle fetching content based on a token.
 * @param {string} token - The unique identifier for the content.
 */
app.get('/content/:token', (req, res) => {
    const token = req.params.token;
    const filePath = path.join(DataDirectory, `${token}.txt`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).json({ error: 'File not found' });
            } else {
                res.status(500).json({ error: 'Error reading file' });
            }
        } else {
            res.json({ content: data });
        }
    });
});

/**
 * Route to serve the main HTML file for all other routes.
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

// Start the server and listen on the specified port and address
app.listen(port, adress, () => {
    console.log(`Server is running at http://${adress}:${port}`);
});

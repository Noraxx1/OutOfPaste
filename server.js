import express from 'express';
import fs from 'fs';
import LRU from 'lru-cache';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { createRequire } from 'module';
import { URL } from 'url';
import settings from './config.js';
import terminal from'./terminal.js';

const require = createRequire(import.meta.url);
const { 
  address, 
  DataDirectory, 
  DatabaseString, 
  HosterName, 
  MaxChar, 
  MinChar, 
  MaximumRequests, 
  RatelimitMessage, 
  SaveMetod, 
  fileCreationCacheMax, 
  fileCreationCacheMaxAge, 
  port, 
  windowMs, 
  dataBaseName,
  style,
} = settings;

if (port < 1024) {
  terminal.warning('If you encounter an error when using a port below 1024, try running the code with administrative privileges.', { showPath: true, showLine: true, showDate: true });
}
if (port == 0) {
  terminal.warning('While port 0 is technically a valid port expect severe issues.', { showPath: true, showLine: true, showDate: true });
}
if (typeof style === `string`) {
  terminal.warning('The style has currently no effect.', { showPath: true, showLine: true, showDate: true });
}

if (port < 0) {
  terminal.error('The port you are trying to acces is invalid.', { showPath: true, showLine: true, showDate: true });
}
if (SaveMetod == "file" & typeof DataDirectory !== 'string') {
  terminal.error('DataDirectory has not set in config.js,exiting.',{ showPath: true, showLine: true, showDate: true  })
}
if (SaveMetod !== "file" & typeof DatabaseString !== 'string') {
  terminal.error('DatabaseString has not been set in config.js even if required,exiting.',{ showPath: true, showLine: true, showDate: true  })
}

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

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

/*
 * Route to send server-side settings to client
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/SettingsPayload', (req, res) => {
  res.json({ MinChar, HosterName, MaxChar });
});

/*
 * Route to handle saving content based on a token
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.post('/create-file', async (req, res) => {
  const { save: data, token } = req.body;

  if (SaveMetod === 'file') {
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
  } else if (SaveMetod === 'mongodb') {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(DatabaseString);

    try {
      await client.connect();
      const db = client.db(dataBaseName);
      const collection = db.collection('pastes');

      await collection.updateOne(
        { token },
        { $set: { data } },
        { upsert: true }
      );

      res.status(200).json({ message: 'Paste saved successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Error saving paste' });
    } finally {
      await client.close();
    }
  } else {
    res.status(400).json({ error: 'Invalid SaveMetod' });
  }
});

/*
 * Route to fetch content based on a token
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/content/:token', async (req, res) => {
  const token = req.params.token;
  if (SaveMetod === 'file') {
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
  } else if (SaveMetod === 'mongodb') {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(DatabaseString);

    try {
      await client.connect();
      const db = client.db(dataBaseName);
      const collection = db.collection('pastes');

      const result = await collection.findOne({ token });

      if (result) {
        res.json({ content: result.data });
      } else {
        res.status(404).json({ error: 'Paste not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error fetching file from MongoDB' });
    } finally {
      await client.close();
    }
  } else {
    res.status(400).json({ error: 'Invalid SaveMetod' });
  }
});

/*
 * Route to serve the main HTML file for unmatched routes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

app.listen(port, address, () => {
  console.log(`Server is running at http://${address}:${port}`);
});

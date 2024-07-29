const express = require('express');
const sqlite = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());

const db = initializeDatabase('./media.db');

app.get('/hello', (req, res) => {
  const responseBody = { Hello: 'World' };
  res.json(responseBody);
});

app.get('/photos', (req, res) => {
  db.all('SELECT * FROM media', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(rows);
  });
});

app.post('/photos', (req, res) => {
  const { name, year, genre, poster, description } = req.body;

  if (!name || !year || !genre || !poster || !description) {
    res.status(400).json({ error: 'Bad Request - Missing required fields' });
    return;
  }

  const stmt = db.prepare('INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)');
  stmt.run([name, year, genre, poster, description], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ message: 'Photo item created successfully' });
  });

  stmt.finalize();
});

app.delete('/photos/:id', (req, res) => {
  const photoId = req.params.id;

  db.run('DELETE FROM media WHERE id = ?', [photoId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(204).json(); // Assuming successful deletion
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function initializeDatabase(filename) {
  const db = new sqlite.Database(filename, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the media database.');
      createMediaTable(db);
    }
  });

  return db;
}

function createMediaTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY,
      name CHAR(100) NOT NULL,
      year CHAR(100) NOT NULL,
      genre CHAR(256) NOT NULL,
      poster CHAR(2048) NOT NULL,
      description CHAR(1024) NOT NULL
    )
  `);

  db.all(`SELECT COUNT(*) AS count FROM media`, (err, result) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (result[0].count === 0) {
      insertDummyEntries(db);
    } else {
      console.log('Database already contains', result[0].count, 'item(s) at startup.');
    }
  });
}

function insertDummyEntries(db) {
  const entries = [
    [
      'Arcane',
      '2021',
      'animation, action, adventure, tv-show',
      'https://www.nerdpool.it/wp-content/uploads/2021/11/poster-arcane.jpg',
      'Set in Utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League Of Legends champions and the power that will tear them apart.',
    ],
    [
      'Celeste',
      '2018',
      'platformer, video-game',
      'https://upload.wikimedia.org/wikipedia/commons/0/0f/Celeste_box_art_full.png',
      'Celeste is a critically acclaimed two-dimensional platform game developed by Maddy Makes Games. The player controls Madeline, a young woman who sets out to climb Celeste Mountain. The game features tight controls, challenging levels, and a touching story about overcoming personal demons.',
    ],
  ];

  const stmt = db.prepare('INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)');

  entries.forEach((entry) => {
    stmt.run(entry, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Inserted dummy entry into the database');
      }
    });
  });

  stmt.finalize();
}

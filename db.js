const sqlite3 = require('sqlite3')

let db = new sqlite3.Database('./musistik.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run(`
    CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(26) NOT Null UNIQUE,
        email TEXT NOT Null UNIQUE,
        password VARCHAR(100)
    )
`)
db.run(`
    CREATE TABLE IF NOT EXISTS Playlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image BLOB,
        private NUMERIC,
        playlistOwner VARCHAR(26),
        FOREIGN KEY(playlistOwner) REFERENCES User(id)
    )
`)
db.run(`
    CREATE TABLE IF NOT EXISTS Song (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        artistName VARCHAR(26)
    )
`)
db.run(`
    CREATE TABLE IF NOT EXISTS SongsInPlaylist (
        playlistId INTEGER,
        songId INTEGER,
        FOREIGN KEY(playlistId) REFERENCES Playlist(id),
        FOREIGN KEY(songId) REFERENCES Song(id)
    )
`)

exports.createUserAccount = function(username, email, password, callback) {
    const query = "INSERT INTO User (username, email, password) VALUES(?, ?, ?)"
    const values = [username, email, password]

    db.run(query, values, function(error) {
        callback(error)
    })
}

exports.signIn = function(username, callback) {
    const query = "SELECT * FROM User WHERE username = ?"

    db.all(query, [username], function(error, users) {
        callback(error, users[0])
    })
}
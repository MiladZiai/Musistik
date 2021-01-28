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
        playlistOwner INTEGER,
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

exports.createPlaylist = function(model, callback) {
    const query = "INSERT INTO Playlist (title, image, private, playlistOwner) VALUES(?, ?, ?, ?)"
    const values = [model.title, model.playlistImage, model.private, model.playListOwner]

    db.run(query, values, function(error) {
        callback(error)
    })
}

exports.getAllPlaylistsByUsername = function(userId, callback) {
    const query = `SELECT * 
                    FROM Playlist
                    WHERE playlistOwner = ?`
    
    db.all(query, [userId], function(error, playlist) {
        callback(error, playlist)
    })
}

exports.getAllUsers = function(callback) {
    const query = "SELECT username, email FROM User"

    db.all(query, function(error, users) {
        callback(error, users)
    })
}

exports.getAllPublicPlaylists = function(callback) {
    const query = "SELECT title, image FROM Playlist WHERE private = ?"
    
    db.all(query, [0], function(error, publicPlaylists) {
        callback(error, publicPlaylists)
    })
}
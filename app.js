'use strict'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./private/mysql-credentials.js');

connection.connect();

const app = express();

app.use(cors())

app.use(bodyParser.json());

//--->endpoints

app.get('/read', (req, res) => {
  connection.query('SELECT * FROM books WHERE haveread = 1;', (err, results, fields) => {
    if (err) throw err;
      console.log(results);
      res.send(results);
  })
})

app.get('/notread', (req, res) => {
  connection.query('SELECT * FROM books WHERE haveread = 0;', (err, results, fields) => {
    if (err) throw err;
      console.log(results);
      res.send(results);
  })
})

app.get('/books/:booktitle', (req, res) => {
  connection.query(`SELECT * FROM books WHERE title = '${req.params.booktitle}';`, (err, results, fields) => {
    if (err) throw err;
      console.log(results);
      res.send(results);
  })
})

app.post('/addbook', (req, res) => {
  connection.query(`
    INSERT INTO books (title, author, year, genre, haveread)
    VALUES ('${req.body.title}', '${req.body.author}', '${req.body.year}', '${req.body.genre}', '0');
    `, (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
})

app.put('/updatebook', (req, res) => {
  connection.query(`
      UPDATE books
        SET
          author = '${req.body.author}',
          year = '${req.body.year}',
          genre = '${req.body.genre}',
          haveread = ${req.body.haveread}
        WHERE
            title = '${req.body.title}';
    `, (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
})

app.delete('/deletebook/:booktitle', (req, res) => {
  connection.query(`
      DELETE FROM books
        WHERE title = '${req.params.booktitle}';
    `, (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
})

app.listen(3001);

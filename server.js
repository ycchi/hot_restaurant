// import dependencies
const express = require('express');
const connection = require('./db/connection');
const path = require('path');

// create server using express() and set a port
const app = express();
const PORT = process.env.PORT || 3000;

// set up our middleware to handle incoming POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up our routes
app.get('/', function(req, res) {
  // send home.html when user hits "root"
  res.sendFile(path.join(__dirname, './html/home.html'));
});

app.get('/tables', function(req, res) {
  // send tables.html when user hits "/tables"
  res.sendFile(path.join(__dirname, './html/tables.html'));
});

app.get('/add', function(req, res) {
  // send add.html when user hits "/add"
  res.sendFile(path.join(__dirname, './html/add.html'));
});

// API ROUTES

// GET all tables
app.get('/api/tables', function(req, res) {
  // query db for all table data
  connection.query('SELECT * FROM tables', function(err, tableData) {
    if (err) {
      return res.status(500).json(err);
    }
    // if no error, send back array of table data
    res.json(tableData);
  });
});

// POST route that takes in req.body and creates a new reservation
app.post('/api/tables', function(req, res) {
  // retrieve count of how many people are NOT on waiting list
  connection.query('SELECT COUNT(*) AS waitingCount FROM tables WHERE isWaiting = false', function(
    err,
    waitingListData
  ) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    // check if number of people NOT on waiting list is 5 or greater
    if (waitingListData[0].waitingCount >= 5) {
      req.body.isWaiting = true;
    }

    // insert new table reservation using req.body as data
    connection.query('INSERT INTO tables SET ?', req.body, function(err, insertResult) {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      // if insert was successful
      res.json({ status: 'successful' });
    });
  });
});

app.get('*', function(req, res) {
  res.send('<h1>💁‍♀️ 404 Error!</h1>');
});

// turn on server, make sure this is last in the file
app.listen(PORT, () => console.log(`🗺️ You are now on localhost:${PORT}.`));

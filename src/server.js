var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run('CREATE TABLE inventory (time_from varchar(5), time_to varchar(5), reservations)');
  var stmt = db.prepare('INSERT INTO inventory VALUES (?,?,?)');
  stmt.run("07:00", "12:00", 3);
  stmt.finalize();
});

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/inventory', async (req, res) => {
  db.all('SELECT * FROM inventory', (_err, inventory) => {
    res.json(inventory);
  });
});

app.post('/inventory/:time_from/:time_to/:reservations', async (req, res) => {
  const row = req.params;
  const stmt = db.prepare('INSERT INTO inventory VALUES (?,?,?)');
  stmt.run(row.time_from, row.time_to, row.reservations);
  stmt.finalize();
  res.json(row);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

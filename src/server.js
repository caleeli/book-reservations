var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function () {
  db.run('CREATE TABLE inventory (time_from varchar(5), time_to varchar(5), reservations)');
  var stmt = db.prepare('INSERT INTO inventory VALUES (?,?,?)');
  stmt.run("07:00", "12:00", 3);
  db.run('CREATE TABLE reservations (name text, email text, party_size int, date char(10), time char(5))');
  stmt.finalize();
});

const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/inventory/:from', async (req, res) => {
  const items = [];
  db.all('SELECT * FROM inventory', (_err, inventory) => {
    db.all('SELECT * FROM reservations order by date, time', (_err, reservations) => {
      const date = moment(req.params.from);
      for (let i = 0; i < 10; i++) {
        const dateF = date.format("YYYY-MM-DD");
        inventory.forEach(inventory => {
          const time = moment(`${dateF} ${inventory.time_from}`);
          const time2 = moment(`${dateF} ${inventory.time_from}`);
          const timeTo = moment(`${dateF} ${inventory.time_to}`);
          while (time < timeTo) {
            time2.add(15, "minutes");
            let available = inventory.reservations;
            reservations.filter(r => {
              const dt = moment(`${r.date} ${r.time}`);
              return dt >= time && dt < time2;
            }).forEach(reservation => available -= reservation.party_size);
            const item = {
              date: dateF,
              time: time.format("HH:mm"),
              available,
            };
            items.push(item);
            time.add(15, "minutes");
          }
        });
        date.add(1, "days");
      }
      res.json(items);
    });
  });
});

app.post('/reservation', async (req, res) => {
  const row = req.body;
  const stmt = db.prepare('INSERT INTO reservations VALUES (?,?,?)');
  stmt.run(row.time_from, row.time_to, row.reservations);
  stmt.finalize();
  res.json(row);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

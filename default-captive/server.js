const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// setup db
const db = new sqlite3.Database("data.db");
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password TEXT
  )`);
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve file html
app.use(express.static(path.join(__dirname, "public")));

// route POST untuk simpan data
app.post("/save", (req, res) => {
  const { email, password } = req.body;
  db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, email, password });
  });
});

// route untuk cek isi db
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.send("Error: " + err.message);
    }
    let html = "<h1>Daftar Users</h1><ul>";
    rows.forEach(row => {
      html += `<li>${row.email} - ${row.password}</li>`;
    });
    html += "</ul>";
    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

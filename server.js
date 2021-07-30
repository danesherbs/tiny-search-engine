const express = require("express");
const exphbs = require("express-handlebars");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./database.db");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  const query = req.query.query || "";
  const target = query.replace(/[^a-zA-Z0-9 -]/g, "");
  const sql =
    target.length === 0
      ? `SELECT title, body
         FROM posts`
      : `SELECT title, body
         FROM posts
         WHERE posts MATCH '${target}'
         ORDER BY bm25(posts)`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render("home", {
      posts: rows,
    });
  });
});

app.listen(process.env.PORT || 3000);

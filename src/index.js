const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const users = require("./data/users.json");
const movies = require("./data/movies.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// config database
const db = new Database("./src/db/database.db", {
  verbose: console.log,
});

// config engine templates
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Endopoint para escuchar peticiones de las películas
//Y crear motor de plantillas
server.get("/movie/:movieId", (req, res) => {
  console.log(req.params.movieId);
  const query = db.prepare("SELECT * FROM movies WHERE id = ?");
  const idMovies = query.get(req.params.movieId);

  res.render("movie", idMovies);
});

server.get("/movies", (req, res) => {
  console.log("Peticion a la ruta GET /movies");
  console.log(req.query.gender);
  const gender = req.query.gender;

  const query = db.prepare("SELECT * FROM movies WHERE gender = ?");
  const allMovies = query.all(gender);

  const response = {
    success: true,
    movies: req.query.gender === "" ? movies : allMovies,
  };

  res.json(response);
});
// Login
server.post("/login", (req, res) => {
  console.log(req.body);
  console.log("Peticion a la ruta LOGIN");
  const email = req.body.email;
  const password = req.body.password;
  const query = db.prepare(
    "SELECT * FROM users WHERE email = ? and password = ?"
  );
  const getUser = query.get(email, password);

  const successfully = {
    success: true,
    userId: "id_de_la_usuaria_encontrada",
  };

  const unsuccessfully = {
    success: false,
    errorMessage: "Usuaria/o no encontrada/o",
  };

  if (getUser) {
    res.json(successfully);
  } else {
    res.json(unsuccessfully);
  }
});

// Registrar nueva usuaria
server.post("/signup", (req, res) => {
  console.log(req.body);
  console.log("Petición a la ruta signup");
  const email = req.body.email;
  const password = req.body.password;
  const selectUser = db.prepare("SELECT * FROM users WHERE email = ?");
  const foundUser = selectUser.get(email);

  if (foundUser === undefined) {
    const query = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    );
    const addUser = query.run(email, password);
    res.json({
      success: true,
      userId: addUser.lastInsertRowid,
    });
  } else{
    res.json({
      success: false,
      message: "el usuario ya existe",
    })
  }
});

//Congifurar servidor de statics
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

//IMAGENES
const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

// Styles
const staticServerStyles = "./src/public-styles";
server.use(express.static(staticServerStyles));

const express = require("express");
const cors = require("cors");
const movies = require("./data/movies.json");
const users = require("./data/users.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// config engine templates
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});



// Endopoint para escuchar peticiones de las películas
server.get("/movie/:movieId", (req, res) => {
  console.log(req.params.movieId);
});

server.get("/movies", (req, res) => {
  console.log("Peticion a la ruta GET /movies");
  console.log(req.query);

  const response = {
    success: true,
    movies: movies,
  };
  const filterGender = response.movies.filter(
    (movie) => movie.gender === req.query.gender
  );

  res.json(filterGender.length === 0 ? movies : filterGender);
});

// Login
server.post("/login", (req, res) => {
  console.log("Peticion a la ruta LOGIN");
  console.log(req.body);
  const foundUser = users.find((user) => {
    return user.email === req.body.email && user.password === req.body.password;
  });

  const successfully = {
    success: true,
    userId: "id_de_la_usuaria_encontrada",
  };

  const unsuccessfully = {
    success: false,
    errorMessage: "Usuaria/o no encontrada/o",
  };

  if (foundUser) {
    res.json(successfully);
  } else {
    res.json(unsuccessfully);
  }
});

//IMAGENES
const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

//Congifurar servidor de statics
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

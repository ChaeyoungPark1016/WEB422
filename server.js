/********************************************************************************* * 
 
* WEB422 â€“ Assignment 1

* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *

* Name: Chaeyoung Park Student ID: 011784154 Date: May 18, 2023

* Cyclic Link: https://cute-erin-capybara-yoke.cyclic.app/

* ********************************************************************************/

const cors = require("cors");
const express = require("express");
const path = require("path");

require('dotenv').config({path:"./Env.env"});

// Initializing app and port 
const app = express();
const HTTP_PORT= process.env.PORT || 8080;

app.use(express.static(__dirname));


// Setting for Data 
const MoviesDB= require("./modules/moviesDB.js");
const { error } = require("console");
const db = new MoviesDB;

// Ensure server can parse JSON in request body for certain routes
app.use(express.json());
// Preventing cross-origin restrictions for secure API access from different sources
app.use(cors());

// Home page Route
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname,"index.html"));
})
    
// "Initializing" the Module before the server starts
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{ app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`); });
    }).catch((err)=>{ console.log(err);
    });    
    
///// Add the routes /////
// Post/api/movies
app.post("/api/movies", (req,res) => {
  db.addNewMovie(req.body).then((movie) => {res.status(201);
  }).catch(() => { res.status(500).json({error: "Fail to add a new movie"});
  });
})
  
// Get/api/movies
// It will use these values to return all "Movie" objects for a specific "page" to the client as well as optionally filtering by "title"
app.get("/api/movies", (req, res)=>{
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((movie) => { res.json(movie);})
    .catch((err) => { res.status(500).json(err)});
})

// Get /api/movies
// It will use these values to return all "Movie" objects for a specific "page" to the client as well as optionally filtering by "title"
app.get("/api/movies", (req, res) => {
    const { page, perPage, title } = req.query;
  
    db.getAllMovies(page, perPage, title)
      .then((movies) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error("Error while retrieving movies:", err);
        res.status(500).json({ error: "Failed to retrieve movies" });
      });
  });
  
    
// Get/api/movies
// It will use this parameter to return a specific "Movie" object to the client
app.get("/api/movies/:_id", (req, res)=>{
    db.getMovieById(req.params._id)
    .then((movie) => {res.json(movie)})
    .catch(() => { res.status(500).json({error: `Fail to load a movie`});
    });
})
    
    
// PUT /api/movies
// It will use these values to update a specific "Movie" document in the collection and return a success / fail message to the client
app.put("/api/movies/:_id", (req, res)=>{
    db.updateMovieById(req.body, req.params._id)
    .then((movie) => { res.json({message: `Movie has updates`})
    })
    .catch(() => {
    res.status(500).json({error: `Fail to update a movie`});
    });
})

    
// DELETE /api/movies
// It will use this value to delete a specific "Movie" document from the collection and return a success / fail message to the client
app.delete("/api/movies/:id", (req, res) => { const id = req.params.id;

db.deleteMovieById(id).then(() => {
    res.status(201).json({ message: `${id} has deleted` });
    })
    .catch((err) => { res.status(500).json({ error: "Fail to delete a movie" });
    });
})
    
// Not Found Page
app.use((req, res) => {
    res.status(404).send("Page Not Found");
 });
    



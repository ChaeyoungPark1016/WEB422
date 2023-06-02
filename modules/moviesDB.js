const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating a schema for the database
const movieSchema = new Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: Date,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    dvd: Date,
    lastUpdated: Date
  }
}
);

module.exports = class MoviesDB {
  constructor() {
    // We don't have a `Movie` object until initialize() is complete
    this.Movie = null;
  }

  // Establish a connection with the MongoDB server and initialize the "Movie" model with the "movies" collection 
  // Pass the connection string to `initialize()`
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(
        connectionString,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Movie = db.model("movies", movieSchema);
        resolve();
      });
    });
  }

  //  Create a new movie in the collection using the object passed in the "data" parameter
  async addNewMovie(data) {
    const newMovie = new this.Movie(data);
    await newMovie.save();
    return newMovie;
  }

  // Return an array of all movies for a specific page (sorted by year), given the number of items per page
  getAllMovies(page, perPage, title) {
    let findBy = title ? { title } : {};

    if (+page && +perPage) {
      return this.Movie.find(findBy).sort({ year: +1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  // Return a single movie object whose "_id" value matches the "Id" parameter
  getMovieById(id) {
    return this.Movie.findOne({ _id: id }).exec();
  }

  // Overwrite an existing movie whose "_id" value matches the "Id" parameter, using the object passed in the "data" parameter.
  updateMovieById(data, id) {
    return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
  }

  // Delete an existing movie whose "_id" value matches the "Id" parameter
  deleteMovieById(id) {
    return this.Movie.deleteOne({ _id: id }).exec();
  }
}
const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//MIDDLEWARE

const reduceMovies = reduceProperties("movie_id", {
  movie_id: ["movie_id"],
  title: ["title"],
  rating: ["rating"],
  runtime_in_minutes: ["runtime_in_minutes"],
  description: ["description"],
  image_url: ["image_url"],
});

//HELPER
function listActiveMovies() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

async function list(isShowing) {
  if (isShowing) {
    return await listActiveMovies();
  }
  return knex("movies").select("*").then(reduceMovies);
}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

module.exports = {
  list,
  listActiveMovies,
  read,
};
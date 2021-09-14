const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list(movie_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ movie_id })
    .then((data) => {
      return data.map((item) => {
        return addCritics(item);
      });
    });
}

function create(review) {
  return knex("reviews")
    .insert(review)
    .returning("*")
    .then((createdReview) => createdReview[0]);
}

const addCritics = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function update(newReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: newReview.review_id })
    .update(newReview, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function updateAddCritics(review) {
  return knex("reviews as r")
    .select("*")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({ "r.review_id": review.review_id })
    .first()
    .then(addCritics);
}

function listReview(movieId) {
  return knex("review as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then((data) => {
      return data.map((item) => {
        return addCritics(item);
      });
    });
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  list,
  create,
  read,
  update,
  delete: destroy,
  listReview,
  updateAddCritics,
};
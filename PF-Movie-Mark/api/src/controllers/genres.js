require("dotenv").config();
const { API_KEY } = process.env;
const axios = require("axios");
const BASE_URL = "https://api.themoviedb.org/3";
const { Genre } = require("../db");

const getGenres = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    const allGenresApi = response.data.genres.map((genre) => ({
      name: genre.name,
    }));

    for (const genre of allGenresApi) {
      await Genre.findOrCreate({
        where: {
          name: genre.name,
        },
      });
    }

    const allGenresFound = await Genre.findAll();

    return allGenresFound;
  } catch (e) {
    console.error("Error fetching or saving genres:", e.message);
    throw e;
  }
};

module.exports = { getGenres };

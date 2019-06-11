require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());


app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }
  //move to the next middleware
  next();
});


app.get('/movie', function handleGetMovie(req, res) {
  const { genre = '', country = '', avg_vote} = req.query;

  
  let results = MOVIES;
 if (genre) {
  results = results.filter(movie => {
    return movie.genre.toLowerCase().includes(genre.toLowerCase());
  });
}
console.log(results)
if (country) {
  results = results.filter(movie => {
    return movie.country.toLowerCase().includes(country.toLowerCase());
  });
}
  console.log(results)
if(avg_vote) {
    results = results.filter(movie => {
      return movie.avg_vote >= avg_vote;
    });
  }
console.log(results)
  res.json(results);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRouter = require('./routes/posts');
const app = express();

mongoose
  .connect(
    'mongodb+srv://Nicola:YFRod2LcuXL1N2el@cluster0.ck6vx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to database...');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

/**
 * @next farà andare avanti la richiesta e non blocherà il processo.
 * @password: YFRod2LcuXL1N2el
 */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((re, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-WIth,Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PATCH,PUT,DELETE,OPTIONS'
  );
  next();
});
app.use('/api/posts', postsRouter);
module.exports = app;

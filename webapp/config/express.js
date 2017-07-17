const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config');
const expressLayouts = require("express-ejs-layouts");

module.exports = function(app){

  mongoose.connect(config.db);

  app.set('views', config.rootPath+'views');
  app.set("view engine", "ejs");
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(config.rootPath+'public'));

  app.use(passport.initialize());
  app.use(passport.session());

};
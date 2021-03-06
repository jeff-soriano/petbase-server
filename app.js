const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { mongoDBUrl } = require("./config/env.dev");

// IMPORT MODELS
require('./models/User');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(mongoDBUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.json());

//IMPORT ROUTES
require('./routes/userRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
});
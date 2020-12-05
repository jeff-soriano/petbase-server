const mongoose = require('mongoose');
const { Schema } = mongoose;

const petSchema = new Schema({
    name: String,
    birthdate: String,
    gender: String,
    species: String,
    weight: Number,
    description: String,
    imgFile: String,
    imgKey: String
});

const userSchema = new Schema({
    username: String,
    pets: [petSchema]
});

mongoose.model('users', userSchema);
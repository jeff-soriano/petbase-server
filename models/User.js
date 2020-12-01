const mongoose = require('mongoose');
const { Schema } = mongoose;

const petSchema = new Schema({
    name: String,
    birthdate: Date,
    description: String,
    imgFile: String,
    imgKey: String
});

const userSchema = new Schema({
    username: String,
    pets: [petSchema]
});

mongoose.model('users', userSchema);
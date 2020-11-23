const mongoose = require('mongoose');
const { Schema } = mongoose;

const petSchema = new Schema({
    name: String,
    birthdate: Date,
    description: String
})

mongoose.model('pets', petSchema);
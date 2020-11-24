const mongoose = require('mongoose');
const User = mongoose.model('users');
const cors = require('cors')
const http = require("http");

const corsOptions = {
    origin: 'http://localhost:3000'
}

module.exports = (app) => {
    const server = http.createServer(app);
    app.use(cors(corsOptions));

    // Return all pets that belong to a user
    app.get(`/api/users/:username/pets`, async (req, res) => {
        const { username } = req.params;
        let sendObj = null;

        const user = await User.findOne({ username: username });
        if (user) sendObj = user.pets;
        else sendObj = [];

        return res.status(200).send(sendObj);
    });

    // Add a pet to the user
    app.post(`/api/users/:username/pets`, async (req, res) => {
        const { username } = req.params;

        const user = await User.updateOne(
            { username: username },
            { $push: { pets: req.body } },
            { upsert: true });

        return res.status(201).send({
            error: false,
            user
        })
    })

    app.put(`/api/users/:username/pets/:id`, async (req, res) => {
        const { username, id } = req.params;

        const user = await User.updateOne(
            { username: username, "pets._id": id },
            { $set: { "pets.$": req.body } });

        return res.status(202).send({
            error: false,
            user
        })

    });

    app.delete(`/api/users/:username/pets/:id`, async (req, res) => {
        const { username, id } = req.params;

        const user = await User.updateOne(
            { username: username },
            { $pull: { pets: { _id: id } } });

        return res.status(202).send({
            error: false,
            user
        })

    })
}
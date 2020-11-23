const mongoose = require('mongoose');
const Pet = mongoose.model('pets');
const cors = require('cors')
const http = require("http");

const corsOptions = {
    origin: 'http://localhost:3000'
}

module.exports = (app) => {
    const server = http.createServer(app);
    app.use(cors(corsOptions));

    app.get(`/api/pets`, async (req, res) => {
        let pets = await Pet.find();
        console.log(pets);
        return res.status(200).send(pets);
    });

    app.post(`/api/pets`, async (req, res) => {
        let pet = await Pet.create(req.body);
        console.log(req.body);
        return res.status(201).send({
            error: false,
            pet
        })
    })

    app.put(`/api/pets/:id`, async (req, res) => {
        const { id } = req.params;

        let pet = await Pet.findByIdAndUpdate(id, req.body);

        return res.status(202).send({
            error: false,
            pet
        })

    });

    app.delete(`/api/pets/:id`, async (req, res) => {
        const { id } = req.params;

        let pet = await Pet.findByIdAndDelete(id);

        return res.status(202).send({
            error: false,
            pet
        })

    })

}
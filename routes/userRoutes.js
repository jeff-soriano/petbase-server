const mongoose = require('mongoose');
const User = mongoose.model('users');
const cors = require('cors')
const http = require("http");
const { checkJwt } = require("../authz/check-jwt");
const aws = require("aws-sdk");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const corsOptions = {
    origin: 'http://localhost:3000'
}

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

module.exports = (app) => {
    const server = http.createServer(app);
    app.use(cors(corsOptions));

    // Return all pets that belong to a user
    app.get(`/api/users/:username/pets`, checkJwt, async (req, res) => {
        const { username } = req.params;
        let sendObj = null;

        const user = await User.findOne({ username: username });
        if (user) sendObj = user.pets;
        else sendObj = [];

        return res.status(200).send(sendObj);
    });

    // Add a pet to the user
    app.post(`/api/users/:username/pets`, checkJwt, upload.single('imgFile'), async (req, res) => {
        const { username } = req.params;
        const imgFile = req.file;
        const key = username + "/" + imgFile.originalname;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: imgFile.buffer,
            ContentType: imgFile.mimetype,
            ACL: "public-read"
        };

        s3.upload(params, async (err, data) => {
            const user = await User.updateOne(
                { username: username },
                {
                    $push: {
                        pets: {
                            name: req.body.name,
                            birthdate: req.body.birthdate,
                            description: req.body.description,
                            imgFile: data.Location
                        }
                    }
                },
                { upsert: true });

            return res.status(201).send({
                error: false,
                user
            })
        });
    })

    app.put(`/api/users/:username/pets/:id`, checkJwt, async (req, res) => {
        const { username, id } = req.params;

        const user = await User.updateOne(
            { username: username, "pets._id": id },
            { $set: { "pets.$": req.body } });

        return res.status(202).send({
            error: false,
            user
        })

    });

    app.delete(`/api/users/:username/pets/:id`, checkJwt, async (req, res) => {
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
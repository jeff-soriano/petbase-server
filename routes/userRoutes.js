const mongoose = require('mongoose');
const User = mongoose.model('users');
const cors = require('cors')
const http = require("http");
const { checkJwt } = require("../authz/check-jwt");
const aws = require("aws-sdk");
const multer = require('multer');
const { clientOriginUrl, accessKeyId, secretAccessKey,
    region, bucketName } = require("../config/env.dev");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const allowedMimeTypes = [
    "image/png", "image/jpg", "image/jpeg"
];

const corsOptions = {
    origin: clientOriginUrl,
    allowedHeaders: 'Authorization, Content-Type'
}

const s3 = new aws.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
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

        if (imgFile) {
            if (allowedMimeTypes.includes(imgFile.mimetype)) {
                const key = username + "/" + imgFile.originalname;

                const params = {
                    Bucket: bucketName,
                    Key: key,
                    Body: imgFile.buffer,
                    ContentType: imgFile.mimetype,
                    ACL: "public-read"
                };

                s3.upload(params, async (err, data) => {
                    if (err) console.log(err, err.stack);
                    const user = await User.updateOne(
                        { username: username },
                        {
                            $push: {
                                pets: {
                                    ...req.body,
                                    imgFile: data.Location,
                                    imgKey: key
                                }
                            }
                        },
                        { upsert: true });

                    return res.status(201).send({
                        error: false,
                        user
                    })
                });
            } else {
                return res.status(422).send({
                    error: true
                });
            }
        } else {
            const user = await User.updateOne(
                { username: username },
                {
                    $push: {
                        pets: {
                            ...req.body,
                            imgFile: null,
                            imgKey: null
                        }
                    }
                },
                { upsert: true });

            return res.status(201).send({
                error: false,
                user
            })
        }
    })

    app.put(`/api/users/:username/pets/:id`, checkJwt, upload.single('imgFile'), async (req, res) => {
        const { username, id } = req.params;
        const imgFile = req.file;

        if (imgFile) {
            if (allowedMimeTypes.includes(imgFile.mimetype)) {
                const key = username + "/" + imgFile.originalname;
                const params = {
                    Bucket: bucketName,
                    Key: key,
                    Body: imgFile.buffer,
                    ContentType: imgFile.mimetype,
                    ACL: "public-read"
                };

                s3.upload(params, async (err, data) => {
                    if (err) console.log(err, err.stack);
                    else {
                        const deleteParams = {
                            Bucket: bucketName,
                            Key: req.body.imgKey
                        }

                        s3.deleteObject(deleteParams, (err, data) => {
                            if (err) console.log(err, err.stack);
                        });

                        const user = await User.updateOne(
                            { username: username, "pets._id": id },
                            {
                                $set: {
                                    "pets.$": {
                                        ...req.body,
                                        imgFile: data.Location,
                                        imgKey: key
                                    }
                                }
                            });

                        return res.status(200).send({
                            error: false,
                            user
                        })
                    }
                });
            }
            else {
                return res.status(422).send({
                    error: true
                });
            }
        } else {
            const user = await User.updateOne(
                { username: username, "pets._id": id },
                {
                    $set: {
                        "pets.$.name": req.body.name,
                        "pets.$.birthdate": req.body.birthdate,
                        "pets.$.gender": req.body.gender,
                        "pets.$.weight": req.body.weight,
                        "pets.$.description": req.body.description
                    }
                });

            return res.status(200).send({
                error: false,
                user
            })
        }
    });

    app.delete(`/api/users/:username/pets/:id`, checkJwt, async (req, res) => {
        const { username, id } = req.params;
        const key = req.body.imgKey;

        if (key) {
            const params = {
                Bucket: bucketName,
                Key: key
            }

            s3.deleteObject(params, (err, data) => {
                if (err) console.log(err, err.stack);
            });
        }

        const user = await User.updateOne(
            { username: username },
            { $pull: { pets: { _id: id } } });

        return res.status(200).send({
            error: false,
            user
        })
    })
}
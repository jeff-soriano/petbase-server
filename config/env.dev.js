const dotenv = require("dotenv");

dotenv.config();

const clientOriginUrl = process.env.CLIENT_ORIGIN_URL;

/* AUTH0 */
const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;

/* AWS */
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;


if (!clientOriginUrl) {
    throw new Error(
        ".env is missing the definition of a CLIENT_ORIGIN_URL environmental variable",
    );
}

if (!audience) {
    throw new Error(
        ".env is missing the definition of an AUTH0_AUDIENCE environmental variable",
    );
}

if (!domain) {
    throw new Error(
        ".env is missing the definition of an AUTH0_DOMAIN environmental variable",
    );
}

if (!accessKeyId) {
    throw new Error(
        ".env is missing the definition of an AWS_ACCESS_KEY_ID environmental variable",
    );
}

if (!secretAccessKey) {
    throw new Error(
        ".env is missing the definition of an AWS_SECRET_ACCESS_KEY environmental variable",
    );
}

if (!region) {
    throw new Error(
        ".env is missing the definition of an AWS_REGION environmental variable",
    );
}

if (!bucketName) {
    throw new Error(
        ".env is missing the definition of an AWS_BUCKET_NAME environmental variable",
    );
}

module.exports = {
    clientOriginUrl,
    audience,
    domain,
    accessKeyId,
    secretAccessKey,
    region,
    bucketName
};

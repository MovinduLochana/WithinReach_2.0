const aws = require( "aws-sdk")
const crypto= require( "crypto")
const { promisify } = require( "util")

const randomBytes = promisify(crypto.randomBytes)
const bucket = process.env.AWS_S3_BUKET_NAME;

const s3 = new aws.S3({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_USER_ACCESS_KEY,
    signatureVersion: 'v4'
});

async function generateUploadURL() {
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString("hex");

    const params = ({
        Bucket: bucket,
        Key: imageName,
        Expires: 60 
    });  // valid for 60s

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}

module.exports = {
    generateUploadURL,
}


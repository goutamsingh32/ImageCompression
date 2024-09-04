const AWS = require('aws-sdk');
const { config } = require('./config');

exports.awsOperations = async (filename, filekey, body) => {
    const s3 = new AWS.S3({
        "accessKeyId": config.AWS.accessKeyId,
        "secretAccessKey": config.AWS.secretAccessKey,
        "region": config.AWS.region
    });

    const param = {
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        Body: body,
        ContentType: 'image/webp',
        ACL: "public-read"
    }
    try {
        const uploadData = await s3.putObject(param).promise();
        return { success: true, imageUrl: `https://compressedimage.s3.eu-north-1.amazonaws.com/${filename}` }
    } catch (err) {
        return { success: false, error: err };
    }

}
const service = require('./service')
const csv = require('csv-parser');
const { v4 } = require('uuid');
const { compressImage } = require('./service');


/**
 * Testing
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.homeApi = (req, res) => {
    res.status(200).send({ message: 'working' });
}

/**
 * upload csv file to compress input images
 * @param {import('express').Request} req 
 * @param {import('express').Response} ers 
 */
exports.uploadcsv = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const results = [];
    // Create a readable stream from the buffer and pipe it to csv-parser
    const readableStream = require('stream').Readable.from(req.file.buffer);

    readableStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const uId = v4();
            res.status(200).send({ status: 'success', message: 'Image compression in progress', key: uId, data: results });
            compressImage(results, uId);
        })
        .on('error', (err) => {
            return res.status(500).json({ error: err.message });
        });
};

/**
 * Used to get data with input and output image
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.getfile = async (req, res) => {
    if (req.body?.fileKey) {
        try {
            const csvData = await service.getFileData(req.body.fileKey);
            if (!csvData?.length) {
                return res.status(400).send({ status: 'failure', message: 'Invalid key' });
            }
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send({ status: 'success', data: csvData });
        } catch (err) {
            res.status(500).send({ status: 'failure', message: 'Internal server error' });
        }
    } else {
        res.status(400).send({ status: 'failure', message: 'fileKey missing' });
    }
}
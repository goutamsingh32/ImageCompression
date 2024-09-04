const sharp = require('sharp');
const { FileModel, ProductModel } = require('./model');
const helper = require('./helper');
const axios = require('axios').default;
const json2csv = require('json2csv');

/**
 * Used to compress image quality by 50%
 * @param {*} data json format of formatted csv
 * @param {*} uId unique key for file
 */
exports.compressImage = async (data, uId) => {

    if (data && Array.isArray(data) && data.length) {
        const promises = data.map(async (item) => {
            const imgArray = item["Input Image"].split(',') || [];
            const outputImgArray = [];

            for (const imgUrl of imgArray) {
                try {
                    const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                    const image = Buffer.from(response.data);
                    const processedImageBuffer = await sharp(image).png({ compressionLevel: 9 }).toBuffer();
                    let fileName = 'upload' + (Math.random() * 100).toFixed(0);
                    const uploadData = await helper.awsOperations(fileName, uId, processedImageBuffer);
                    if (uploadData.success) {
                        outputImgArray.push(uploadData.imageUrl);
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            }
            const newProduct = await ProductModel.create(
                {
                    serialNumber: item["S.No"],
                    productName: item['Product Name'],
                    inputImage: imgArray,
                    outputImage: outputImgArray,
                    fileKey: uId
                });
            return newProduct._id;
        })
        try {
            const productIds = await Promise.all(promises);
            await FileModel.create({ fileKey: uId, productID: productIds });
            console.log('New file created:');
        } catch (error) {
            console.error('Error creating file:', error);
        }
    }
}

/**
 * Get data of file that includes input and output image using unique key
 * @param {string} uid unique file key 
 */
exports.getFileData = async (uid) => {
    const productData = await ProductModel.find({ fileKey: uid })?.lean();
    if (!productData?.length) { return []; }
    const jsonData = productData.map(item => {
        const obj = {
            'S.No': item.serialNumber,
            'Product Name': item.productName,
            'Input Image': item.inputImage.join(','),
            'Output Image': item.outputImage.join(',')
        }
        return obj;
    })
    const fields = ['S.No', 'Product Name', "Input Image", "Output Image"];
    const csv = json2csv.parse(jsonData, { fields });
    return csv;
}

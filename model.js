const { mongoose } = require('mongoose');

const FileSchema = new mongoose.Schema({

    productID: [{
        type: mongoose.Types.ObjectId,
        ref: 'ProductSchema',
        required: true
    }],
    fileKey: {
        type: mongoose.Types.UUID,
        required: true
    },
    upload: {
        type: Boolean,
        default: false
    },
})
const FileModel = mongoose.model("file", FileSchema);

const ProductSchema = new mongoose.Schema({
    serialNumber: {
        type: Number,
        required: true
    },
    fileKey: {
        type: mongoose.Types.UUID,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    inputImage: [{
        type: String,
    }],
    outputImage: [{
        type: String,
    }]
})

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = { FileModel, ProductModel }
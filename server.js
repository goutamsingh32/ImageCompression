const express = require('express');
const { mongoose } = require("mongoose");
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const app = express();
const routes = require('./route');

app.use(bodyParser.json());

const dotenv = require('dotenv');

dotenv.config();

routes(app);

const mongoURI = process.env.MONGO_URI;
const PORT = '5050';

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`server is running on port: ${PORT}`);
    })
})



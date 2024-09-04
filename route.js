const controller = require('./controller');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

module.exports = function (app) {
    app.route('/').get(controller.homeApi);
    app.route('/uploadcsv').post(upload.single('file'), controller.uploadcsv);
    app.route('/getfile').post(controller.getfile);
}

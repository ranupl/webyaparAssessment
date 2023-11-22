const express = require("express");
const userController = require("../controller/userController");
const routes = express.Router();
const upload = require("../middleware/mutler");
    
routes.route('/').get(userController.loginController);
routes.route('/logout').get(userController.logoutController);
routes.route('/upload').post(upload.single("photos"), userController.uploadImageController);

module.exports = routes;
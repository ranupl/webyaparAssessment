const { UserDB } = require('../model/user'); 

async function loginController(req, res) {
    res.render("index");
}

async function logoutController(req, res) {
    res.render("index");
}

async function uploadImageController(req, res) { 
    try {
        const email = req.user.email;
        const user = await UserDB.findOne({email});
        if(user){
            user.photos.push(req.file.filename);
        }
        await user.save();
        res.render("dashboard", {user});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = {loginController, logoutController, uploadImageController};

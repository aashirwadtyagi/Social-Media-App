const router = require('express').Router();
const userModel = require('../models/userModel.js');
const User = require('../models/userModel.js');

router.post('/register', async (req, res) => {
    // const user = await new userModel({
    //     userName: "Aashirwaddd",
    //     email: "aashirwadtyagi@gmail.comdd",
    //     password: "abcddd"
    // })
    // await user.save();
    // res.send("ok")
    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const salt = await bcrypt.genSalt(10);
        const user = await newUser.save();
        res.status(200).json 
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;

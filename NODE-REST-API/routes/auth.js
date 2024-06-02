const router = require('express').Router();
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
    // const user = await new userModel({
    //     userName: req.body.userName,
    //     email: req.body.email,
    //     password: req.body.password
    // })
    // await user.save();
    // res.send("ok")
    
    try {
        //new password will be hashed using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)  
        
        //create user
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword
        });


        //save user
        const user = await newUser.save();
        res.status(200).json(user) 
    } catch (error) {
        res.status(500).json(error)
    }
});

//LOGIN ROUTE
router.post("/login", async (req, res)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("User not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Invalid password")

        //if user enters valid email and password
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json("error")
    }
})


module.exports = router;

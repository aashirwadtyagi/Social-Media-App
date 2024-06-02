const router = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

//UPDATE USER Route

router.put("/:id", async (req, res)=>{
    //if user id doesnt match with the given id
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //password
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        //user_update
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Account has been Updated")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        return res.status(403).json("you can't update this user")
    }
})

//DELETE USER Route

router.delete("/:id", async (req, res)=>{
    //if user id doesnt match with the given id
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //user_update
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        return res.status(403).json("you can't delete this user")
    }
})
//GET A USER

router.get("/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...rest} =user._doc
        res.status(200).json(rest)
    } catch (error) {
        res.status(500).json("not found")
    }
})
//FOLLOW A USER

router.put('/:id/follow', async (req, res)=>{
    if(req.body.userId !==  req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({followers: {$push: req.body.userId}})
                await currentUser.updateOne({following: {$push: req.body.id}})
                res.status(200).json("Successfully followed this user")
            }else{
                res.status(403).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You cant follow yourself")
    }
})
//UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res)=>{
    if(req.body.userId !==  req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({followers: {$pull: req.body.userId}})
                await currentUser.updateOne({following: {$pull: req.body.userid}})
                res.status(200).json("Successfully unfollowed this user")
            }else{
                res.status(403).json("You already unfollowed this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You cant unfollowed yourself")
    }
})

module.exports = router;


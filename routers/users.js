const {User} = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs') ; // for hash password
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get(`/`, async  (req,res) => {
    const userlist = await  User.find().select('-passwordHash') ;   // we doent want people to see password of user so we remove that feild  .select('-passwordHash')
    if(!userlist){
        res.status(500).json({success : false})
    }
     res.send(userlist);
})

router.get(`/:id`, async  (req,res) => {
    const user = await  User.findById(req.params.id).select('-passwordHash');
    if(!user){
        res.status(500).json({message :'  the user with this id does not exist' })
    }
     res.status(200).send(user);
})

router.post('/register',async (req,res) => {
    let user = new User({
        name : req.body.name,
        email : req.body.email,
        passwordHash : bcrypt.hashSync(req.body.password, 10), 
        phone : req.body.phone,
        isAdmin :  req.body.isAdmin,
        street : req.body.street,
        apartment : req.body.apartment,
        zip : req.body.zip,
        state : req.body.state,
        country : req.body.country,
    })
    user = await user.save();
    if(!user)
    return res.status(404).send('the user has not been created ')
    
    res.send(user);
})

router.post('/login', async (req,res) =>  {
    const user = await User.findOne({email:req.body.email})

    const secret = process.env.secret; 
    if(!user){
         return res.status(400).send('The user not found');
    }
    if(user && bcrypt.compareSync(req.body.password , user.passwordHash)) {
        const token = jwt.sign(
            {
                userId :  user.id,
                isAdmin : user.isAdmin
            },
            secret,{
                expiresIn:'1d'
            }
        )
        res.status(200).send({ user : user.email , token : token})
    }else{
        res.status(400).send("password is wrong !")
    }
})

router.get(`/get/count`, async  (req,res) => {
    const userCount = await  User.countDocuments();     
    if(!userCount){                                                                         
        res.status(500).json({success : false})
    }
     res.send({
        userCount : userCount
     });
})



router.delete('/:id' ,  (req,res)=> {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user){
            return res.status(200).json({success:true , message:'the user is deleted'})
        }else{
            return res.status(404).json({success : false , message : 'user not found'})
        }
    }).catch(err=> {
        return res.status(400).json({success: false , error :  err})
    })

})


module.exports = router;
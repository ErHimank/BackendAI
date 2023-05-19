const {Apply} = require('../models/order');
const express = require('express');
const router = express.Router();

router.get(`/`, async  (req,res) => {
    const applylist = await  Apply.find();
    if(!applylist){
        res.status(500).json({success : false})
    }
     res.send(applylist);
})

module.exports = router;
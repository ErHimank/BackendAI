const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async  (req,res) => {
    const categorylist = await  Category.find();
    if(!categorylist){
        res.status(500).json({success : false})
    }
     res.status(200).send(categorylist);
})

router.get('/:id', async (req,res)=> {
    const category = await Category.findById(req.params.id);
    if(!category)
    return res.status(500).send('the category with given id was not found!!')
    
    res.status(200).send(category);

})

router.post('/',async (req,res) => {
    let category = new Category({
        name : req.body.name,
        icon : req.body.icon,
        color : req.body.color
    })
    category = await category.save();
    if(!category)
    return res.status(404).send('the category has not been created ')
    
    res.send(category);
})

router.delete('/:id' ,  (req,res)=> {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({success:true , message:'the category is deleted'})
        }else{
            return res.status(404).json({success : false , message : 'category not found'})
        }
    }).catch(err=> {
        return res.status(400).json({succes: false , error :  err})
    })

})

router.put('/:id' , async (req,res)=> {  // this by default update the detal but sen the old one only so new :  true then this will show you updated one !
    const category =  await Category.findByIdAndUpdate(
        req.params.id,
        {
            name : req.body.name,
            icon : req.body.icon || category.icon,
            color : req.body.color
            
        },{new:true}
        )
        if(!category)
        return res.status(404).send('the category cannot be  updated')
    
    res.send(category);
        
})
module.exports = router;
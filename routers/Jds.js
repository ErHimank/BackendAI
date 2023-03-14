const { Jd } = require("../models/Jd");
const express = require("express");
const router = express.Router();




router.get(`/`, async  (req,res) => {
  const jdlist = await  Jd.find() ;   // we doent want people to see password of user so we remove that feild  .select('-passwordHash')
  if(!jdlist){
      res.status(500).json({success : false})
  }
   res.send(jdlist);
})


//API TO ADD A Jd 
router.post(`/`, async (req, res) => {
    let jd = new Jd({
      Position: req.body.Position,
      JobLocation: req.body.JobLocation,
      JobTitle: req.body.JobTitle,
      RoleType: req.body.RoleType,
      BaseSalary: req.body.BaseSalary,
      OTE: req.body.OTE,
      WorkExperience: req.body.WorkExperience,
      AgeLimit: req.body.AgeLimit,
      GraduationYear: req.body.GraduationYear,
      HighestQualification : req.body.HighestQualification ,
      UploadJd : req.body.UploadJd ,
    });
  
   jd = await jd.save();
  
    if (!jd) return res.status(500).send("jd cannot be created");
  
    res.send(jd);
  });

  router.delete("/:id", (req, res) => {
    Jd.findByIdAndRemove(req.params.id)
      .then((jd) => {
        if (jd) {
          return res
            .status(200)
            .json({ success: true, message: "the Jd is deleted" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Jd not found" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ succes: false, error: err });
      });
  });
  

  router.get(`/get/count`, async (req, res) => {
    const jdCount = await Jd.countDocuments();
    if (!jdCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      jdCount : jdCount,
    });
  });

  router.get("/:id", async (req, res) => {
    const jd = await Jd.findById(req.params.id); // if you want to select some properties then write select option after find
    if (!jd) {
      // populate means also shown the categories details
      res.status(500).json({ success: false });
    }
    res.send(jd);
  });



  router.put("/:id", async (req, res) => {
    // this by default update the detal but sen the old one only so new :  true then this will show you updated one !
  
    const jd = await Jd.findByIdAndUpdate(
      req.params.id,
      {
        Position: req.body.Position,
      JobLocation: req.body.JobLocation,
      JobTitle: req.body.JobTitle,
      RoleType: req.body.RoleType,
      BaseSalary: req.body.BaseSalary,
      OTE: req.body.OTE,
      WorkExperience: req.body.WorkExperience,
      AgeLimit: req.body.AgeLimit,
      GraduationYear: req.body.GraduationYear,
      HighestQualification : req.body.HighestQualification ,
      UploadJd : req.body.UploadJd ,
        
      },
      { new: true }
    );
  
    if (!jd) return res.status(500).send("the Jd cannot be updated");
  
    res.send(jd);
  });


  module.exports = router;
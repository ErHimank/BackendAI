const { Jd } = require("../models/Jd");
const express = require("express");
const router = express.Router();

//MAIL SYSTEM
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../env");
const Mailgen = require("mailgen");

router.get(`/`, async (req, res) => {
  const jdlist = await Jd.find(); // we doent want people to see password of user so we remove that feild  .select('-passwordHash')
  if (!jdlist) {
    res.status(500).json({ success: false });
  }
  res.send(jdlist);
});

//API TO ADD A Jd
router.post(`/`, async (req, res) => {
  let jd = new Jd({
    Position: req.body.Position,
    BriefDescription: req.body.BriefDescription,
    JobLocation: req.body.JobLocation,
    JobTitle: req.body.JobTitle,
    JobDescription: req.body.JobDescription,
    RoleType: req.body.RoleType,
    RoleDescription: req.body.RoleDescription,
    BaseSalary: req.body.BaseSalary,
    OTE: req.body.OTE,
    WorkExperience: req.body.WorkExperience,
    AgeLimit: req.body.AgeLimit,
    GraduationYear: req.body.GraduationYear,
    HighestQualification: req.body.HighestQualifzication,
    UploadJd: req.body.UploadJd,
    userID: req.body.userID,
  });

  jd = await jd.save();
  if (!jd) {
    return res.status(500).send("jd cannot be created");
  }
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
    jdCount: jdCount,
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
      BriefDescription: req.body.BriefDescription,
      JobLocation: req.body.JobLocation,
      JobTitle: req.body.JobTitle,
      JobDescription: req.body.JobDescription,
      RoleType: req.body.RoleType,
      RoleDescription: req.body.RoleDescription,
      BaseSalary: req.body.BaseSalary,
      OTE: req.body.OTE,
      WorkExperience: req.body.WorkExperience,
      AgeLimit: req.body.AgeLimit,
      GraduationYear: req.body.GraduationYear,
      HighestQualification: req.body.HighestQualification,
      UploadJd: req.body.UploadJd,
      // userID: req.body.userID,
    },
    { new: true }
  );

  if (!jd) return res.status(500).send("the Jd cannot be updated");

  res.send(jd);
});

router.post("/Email", async (req, res) => {
  let SendEmail = req.body.SendEmail;
  let Position = req.body.Position;
  let JobTitle = req.body.JobTitle;
  let RoleType = req.body.RoleType;
  let BaseSalary = req.body.BaseSalary;
  let ClientName = req.body.ClientName;
  let ClientEmail = req.body.ClientEmail;

  if (!SendEmail) {
    res.status(500).json({ message: "No Email" });
  }
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Aifetch",
      link: "https://aifetch.co",
    },
  });

  let response = {
    body: {
      name: "Himank",
      intro: "New Jd Has Been Posted",
      table: {
        data: [
          {
            Position: Position,
            JobTitle: JobTitle,
            RoleType: RoleType,
            BaseSalary: BaseSalary,
            ClientName: ClientName,
            ClientEmail: ClientEmail,
          },
        ],
      },
      outro: "Go And Check Now!",
    },
  };
  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: [SendEmail],
    subject: "Place Order",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should recieve an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error });
    });
});

const multer = require("multer");
const upload = multer({ dest: "uploads/pdf/" });

router.post("/upload", upload.single("file"), (req, res) => {
  const files = req.file;
  if (!files) return res.status(400).send("No file Upload");
  console.log(files);
  res.send("File uploaded successfully!");
});

module.exports = router;
 
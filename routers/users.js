const { User } = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs"); // for hash password
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");


// function for upload Image
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/heif": "heif",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads/profile");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];

    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });


router.get(`/`, async (req, res) => {
  const userlist = await User.find().select("-passwordHash"); // we doent want people to see password of user so we remove that feild  .select('-passwordHash')
  if (!userlist) {
    res.status(500).json({ success: false });
  }
  res.send(userlist);
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(500).json({ message: "  the user with this id does not exist" });
  }
  res.status(200).send(user);
});

router.post("/register", async (req, res) => {
  try {
    // Check if email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(201).json({ message: "Email already exists" });
    }

    // Create a new user
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      state: req.body.state,
      country: req.body.country,
    });
    await user.save();
    res.status(200).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong !");
  }
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

router.delete("/:id", async (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//Profile Pic and profile
router.put("/profile/:id",uploadOptions.single("image"), async (req, res) => {
  // this by default update the detal but sen the old one only so new :  true then this will show you updated one !
  const file = req.file;
  if (!file) return res.status(400).send("No image Upload");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/profile/`;
  const userPic = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      state: req.body.state,
      country: req.body.country,
      image: `${basePath}${fileName}`,
    },
    { new: true }
  );

  if (!userPic)
    return res.status(500).send("the new candidate cannot be updated");

  res.status(200).send(userPic);
});

//Admin Update Api for selected rejected
router.put("/isAdmin/:id", async (req, res) => {
  // this by default update the detal but sen the old one only so new :  true then this will show you updated one !

  try {
    const id = req.params.id;
    const myModel = await User.findById(id);
    myModel.isAdmin = !myModel.isAdmin;
    await myModel.save();
    res.json(myModel);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

module.exports = router;

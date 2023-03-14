const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { mongoose } = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];

    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  // localhost:3000/api/AI/Products?categories=23456,23964/
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productlist = await Product.find(filter).populate("category");
  if (!productlist) {
    res.status(500).json({ success: false });
  }
  res.send(productlist);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category"); // if you want to select some properties then write select option after find
  if (!product) {
    // populate means also shown the categories details
    res.status(500).json({ success: false });
  }
  res.send(product);
});

//API TO ADD A PRODUCT with single image
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  // For Specific Category Not Accept Other category

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Inavalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("No image Upload");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richdescription: req.body.richdescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countinstock: req.body.countinstock,
    numreviews: req.body.numreviews,
    isfeatured: req.body.isfeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("product cannot be created");

  res.send(product);
});

//API To upload multiple image and update
router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid product id");
    }

    const files = req.files;

    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).json("product cannot be updated");
    res.send(product);
  }
);

// router.post(`/`, uploadOptions.single("image"), async (req, res) => {
//   const category = await Category.findById(req.body.category);
//   if (!category) return res.status(400).send("Invalid Category");
//   const fileName = req.file.filename;
//   const basepath = `${req.protocol}://${req.get("host")}/public/uploads`;

//   let product = new Product({
//     //used let insted of const
//     name: req.body.name,
//     description: req.body.description,
//     richdescription: req.body.richdescription,
//     image: `${basepath}${fileName}`,
//     brand: req.body.brand,
//     price: req.body.price,
//     category: req.body.category,
//     countinstock: req.body.countinstock,
//     rating: req.body.rating,
//     numreviews: req.body.numreviews,
//     isfeatured: req.body.isfeatured,
//   });

//   product = await product.save();

//   if (!product) return res.status(500).send("The product cannot be created !!");

//   res.send(product);
// });

router.put("/:id", async (req, res) => {
  // this by default update the detal but sen the old one only so new :  true then this will show you updated one !
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid  Product Id"); //thisw will give error when wrong id is passed
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richdescription: req.body.richdescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countinstock: req.body.countinstock,
      rating: req.body.rating,
      numreviews: req.body.numreviews,
      isfeatured: req.body.isfeatured,
    },
    { new: true }
  );

  if (!product) return res.status(500).send("the product cannot be updated");

  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ succes: false, error: err });
    });
});

// now here sometimes we need to show how many products do we have in the databse for that we have this api

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isfeatured: true }).limit(count);
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;

// router.get(`/get/count`, async  (req,res) => {
//     const productCount = await  Product.countDocuments();
//     if(!productCount){
//         res.status(500).json({success : false})
//     }
//      res.send({
//         productCount : productCount
//      });
// })

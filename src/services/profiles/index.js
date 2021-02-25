const express = require("express");
const mongoose = require("mongoose");
const UserSchema = require("../profile/schema");
const profilesRouter = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../../cloudinary");

//EXPERIENCES SUB-ROUTES
profilesRouter.get("/:userName/experiences", async (req, res, next) => {
  try {
    const user = await UserSchema.find({ username: req.params.userName });
    if (user) {
      res.send(user[0].experiences);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("This user does not exist");
  }
});

profilesRouter.get("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const { experiences } = await UserSchema.findOne(
      {
        username: req.params.userName,
      },
      {
        _id: 0,
        experiences: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(req.params.experienceId),
          },
        },
      }
    );

    if (experiences && experiences.length > 0) {
      res.send(experiences[0]);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

profilesRouter.post("/:userName/experiences", async (req, res, next) => {
  try {
    const user = await UserSchema.find({ username: req.params.userName });
    if (user) {
      const experience = await UserSchema.findOneAndUpdate(
        { username: req.params.userName },
        {
          $push: { experiences: req.body },
        },
        { runValidators: true, new: true }
      );
      res.send(experience);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("Error this user does not exist");
  }
});

profilesRouter.delete("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const experienceId = req.params.experienceId;
    const user = await UserSchema.find({ username: req.params.userName });
    if (user) {
      const experience = await UserSchema.findOneAndUpdate(
        { username: req.params.userName },
        {
          $pull: {
            experiences: { _id: mongoose.Types.ObjectId(experienceId) },
          },
        },
        {
          new: true,
        }
      );
      res.send(experience);
    } else {
      const error = new Error(`user with this ${req.params.userName} username does not exist`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

profilesRouter.put("/:userName/experiences/:experienceId", async (req, res, next) => {
  let newRole = req.body.role;
  let newCompany = req.body.company;
  let newStartDate = req.body.startDate;
  let newEndDate = req.body.endDate;
  let newDescription = req.body.description;
  let newArea = req.body.area;
  let newUsername = req.body.username;
  try {
    let result = await UserSchema.findOneAndUpdate(
      { username: req.params.userName },
      {
        $set: {
          "experiences.$[inner].role": newRole,
          "experiences.$[inner].company": newCompany,
          "experiences.$[inner].startDate": newStartDate,
          "experiences.$[inner].endDate": newEndDate,
          "experiences.$[inner].description": newDescription,
          "experiences.$[inner].area": newArea,
          "experiences.$[inner].username": newUsername,
        },
      },
      {
        arrayFilters: [{ "inner._id": req.params.experienceId }],
        new: true,
      }
    );
    if (!result) return res.status(404);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

//IMAGE SUB-ROUTE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "striveTest",
  },
});

const cloudinaryMulter = multer({ storage: storage });

profilesRouter.post(
  "/:userName/experiences/:experienceId/picture",
  cloudinaryMulter.single("image"),
  async (req, res, next) => {
    try {
      const path = req.file.path;
      let result = await UserSchema.findOneAndUpdate(
        { username: req.params.userName },
        {
          $set: {
            "experiences.$[inner].image": path,
          },
        },
        {
          arrayFilters: [{ "inner._id": req.params.experienceId }],
          new: true,
        }
      );
      res.status(201).send({ path });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

//CSV SUB-ROUTE
profilesRouter.get("/:userName/experiences", async (req, res, next) => {
  try {
    const user = await UserSchema.find({ username: req.params.userName });
    if (user) {
      res.send(user[0].experiences);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("This user does not exist");
  }
});
module.exports = profilesRouter;

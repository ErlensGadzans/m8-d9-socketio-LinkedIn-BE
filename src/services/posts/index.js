const express = require("express");
const postsModel = require("./schema.js");
const cloudinary = require("../../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const postsRouter = express.Router();

// - POST https://yourapi.herokuapp.com/api/posts/
// Creates a new post
postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new postsModel(req.body);
    await newPost.save();
    res.status(201).send("Post has been added.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// - GET https://yourapi.herokuapp.com/api/posts/
// Retrieve posts
postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await postsModel.find().populate("Profile");
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// - GET https://yourapi.herokuapp.com/api/posts/{postId}
// Retrieves the specified post
postsRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await postsModel.findById(req.params.id);
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// - DELETE https://yourapi.herokuapp.com/api/posts/{postId}
// Removes a post
postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const postToDelete = await postsModel.findByIdAndDelete(req.params.id);
    if (!postToDelete || Object.values(postToDelete).length === 0) {
      const error = new Error(`Thereis no post with id ${req.params.id}`);
      error.httpStatusCode = 404;
      next(error);
    } else {
      res.status(204).send(postToDelete);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// - PUT https://yourapi.herokuapp.com/api/posts/{postId}
// Edit a given post
postsRouter.put("/:id", async (req, res, next) => {
  try {
    const postToEdit = await postsModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    if (!postToEdit) {
      const error = new Error(`Thereis no post with id ${req.params.id}`);
      error.httpStatusCode = 404;
      next(error);
    } else res.status(204).send(postToEdit);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// - POST https://yourapi.herokuapp.com/api/posts/{postId}
// Add an image to the post under the name of "post"
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "linkedinPost" },
});

const cloudinaryMulter = multer({ storage: storage });

postsRouter.post("/:id", cloudinaryMulter.single("image"), async (req, res, next) => {
  try {
    const path = req.file.path;
    let post = await postsModel.findByIdAndUpdate(req.params.id, { img: path }, { new: true });
    res.status(201).send({ path });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = postsRouter;

// #EXTRA: Find a way to return also the user with the posts, in order to have the Name / Picture to show it correcly on the frontend

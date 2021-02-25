const router = require("express").Router();

const profileRouter = require("./profile");
const profilesRouter = require("./profiles");
const postsRouter = require("./posts");

router.use("/profile", profileRouter);
router.use("/profiles", profilesRouter);
router.use("/posts", postsRouter);

module.exports = router;

const express = require("express");
const userSchema = require("./schema");

const profileRouter = express.Router();

const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

profileRouter.get("/", async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (error) {
    next(await errorHandler(error));
  }
});

profileRouter.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id.length === 24) {
      const user = await userSchema.findById(req.params.id);
      if (user) {
        res.send(user);
      } else {
        const err = await errorHandler(`No user found with that ID.`, req.params.id, 404);
        next(err);
      }
    } else {
      const err = await errorHandler(`Invalid user ID.`, req.params.id, 400);
      next(err);
    }
  } catch (error) {
    con;
    next(await errorHandler(error));
  }
});

profileRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    await newUser.save();
    res.status(201).send("New user successfully registered.");
  } catch (error) {
    const err = await errorHandler(error);
    next(err);
  }
});

profileRouter.put("/:id", async (req, res, next) => {
  try {
    if (req.params.id.length === 24) {
      const user = await userSchema.findById(req.params.id);
      if (user) {
        const updateUser = await userSchema.findByIdAndUpdate(req.params.id, req.body, {
          runValidators: true,
          new: true,
        });
        if (updateUser) {
          res.status(200).send("User data successfully updated.");
        } else {
          const err = await errorHandler("", req.params.id, 500);
          next(err);
        }
      } else {
        const err = await errorHandler(`No user found with that ID.`, req.params.id, 404);
        next(err);
      }
    }
  } catch (error) {
    next(await errorHandler(error));
  }
});

profileRouter.delete("/:id", async (req, res, next) => {
  try {
    if (req.params.id.length === 24) {
      const deletedUser = await userSchema.findByIdAndDelete(req.params.id);
      if (deletedUser) {
        res.send("Successfully deleted user.");
      } else {
        next(await errorHandler(`No user found with that ID.`, req.params.id, 404));
      }
    } else {
      next(await errorHandler(`Invalid user ID.`, req.params.id, 400));
    }
  } catch (error) {
    next(await errorHandler(error));
  }
});

module.exports = profileRouter;

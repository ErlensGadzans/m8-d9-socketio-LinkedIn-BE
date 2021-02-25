const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require("validator");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Name too short."],
      maxLength: 50,
    },
    surname: {
      type: String,
      required: true,
      minLength: [3, "Surname too short."],
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Enter an email address."],
      unique: [true, "That email address is taken."],
      lowercase: true,
      validate: [validator.isEmail, "Enter a valid email address."],
    },
    bio: {
      type: String,
    },
    title: {
      type: String,
    },
    area: {
      type: String,
    },
    image: {
      type: String,
      default: "https://res.cloudinary.com/dwx0x1pe9/image/upload/v1611571000/linkedin_default_psyjds.jpg",
    },
    username: {
      type: String,
      required: [true, "Username is missing."],
      unique: [true, "That username is already taken."],
      lowercase: true,
      validate: [validator.isAlphanumeric, "Usernames may only have letters and numbers."],
    },
    password: {
      type: String,
      required: [true, "Password is missing."],
      minLength: [8, "Password should be at least eight characters."],
    },
    experiences: [
      {
        type: new Schema(
          {
            role: String,
            company: String,
            startDate: String,
            endDate: String,
            description: String,
            area: String,
            username: String,
            image: {
              type: String,
              default: "https://res.cloudinary.com/dwx0x1pe9/image/upload/v1611571000/linkedin_default_psyjds.jpg",
            },
          },
          { timestamps: true }
        ),
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);

module.exports = model("users", userSchema);

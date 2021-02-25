const { Schema, model } = require("mongoose");

const postsSchema = new Schema(
  {
    text: String,
    username: String,
    img: String,
    user: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("posts", postsSchema);

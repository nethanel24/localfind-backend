import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
    default: "fa-tag",
  },
}, { timestamps: true });

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
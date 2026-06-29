import mongoose from "mongoose";

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "handled"],
    default: "pending",
  },
}, { timestamps: true });

const requestModel = mongoose.model("Request", requestSchema);

export default requestModel;
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, "Comment cannot exceed 500 characters"],
  },
}, { timestamps: true });

reviewSchema.index({ provider: 1, user: 1 }, { unique: true });

reviewSchema.post("save", async function () {
  const Review = mongoose.model("Review");
  const Provider = mongoose.model("Provider");

  const stats = await Review.aggregate([
    { $match: { provider: this.provider } },
    {
      $group: {
        _id: "$provider",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Provider.findByIdAndUpdate(this.provider, {
      rating: stats[0].avgRating,
      reviewCount: stats[0].count,
    });
  }
});

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
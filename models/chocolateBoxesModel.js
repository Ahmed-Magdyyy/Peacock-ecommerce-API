const mongoose = require("mongoose");
const moment = require('moment-timezone');

const boxSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Name is required"],
      unique: false,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
    },
    images: {
      type: [String],
      required: [true, "images are required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discountedPrice: {
      type: Number,
    },
    pieces: {
      type: [String],
      required: [true, "Weight is required"],
    },
    categoryName: {
      type: String,
      default: "Chocolate Box",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imgURL = `${process.env.BASE_URL}/chocolateBox/${image}`;
      imageList.push(imgURL);
    });
    doc.images = imageList;
  }
};

boxSchema.post("init", (doc) => {
  setImageURL(doc);
});

boxSchema.post("save", (doc) => {
  setImageURL(doc);
});

boxSchema.pre("save", function (next) {
  this.images.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  next();
});


boxSchema.pre('save', function (next) {
  const currentTime = moment().tz('Africa/Cairo').format('YYYY-MM-DDTHH:mm:ss[Z]');

  this.createdAt = currentTime;
  this.updatedAt = currentTime;

  next();
});

boxSchema.pre('findOneAndUpdate', function () {
  this.updateOne({}, { $set: { updatedAt: moment().tz('Africa/Cairo').format('YYYY-MM-DDTHH:mm:ss[Z]') } });
});


const ChocolateBox = mongoose.model("ChocolateBox", boxSchema);
module.exports = ChocolateBox;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // Kept temporarily so existing local records can be normalized on read.
    images: [
      {
        type: String,
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, value) {
        if (!value.imageUrl && value.images?.[0]) {
          value.imageUrl = value.images[0];
        }
        delete value.images;
        delete value.__v;
        return value;
      },
    },
  }
);

module.exports = mongoose.model("Product", productSchema);

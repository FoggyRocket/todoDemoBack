const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El producto debe tener un titulo"],
    },
    price: {
      type: Number,
      required: [true, "El producto debe tener un precio"],
      min: [10, "El precio minimo es de 10"],
    },
    description: {
      type: String,
      required: [true, "El producto debe tener un titulo"],
    },
    //images2:[String], ["https://dylan.com/",....]
    images: {
      type: [
        {
          id: String,
          url: String,
          name: String,
        },
      ],
      min: [1, "El preoducto debe tener minimo una imagen"],
    },
    stock: {
      type: Number,
      min: [0, "El producto debe tener un minimo"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);

const Product = require("../models/Product.model");
const mongoose = require("mongoose");
const { clearRes } = require("../utils/utils");

//unicamente Admin
exports.createProduct = async (req, res, next) => {
  const { isAvailable, ...restProduct } = req.body;
  try {
    const product = await Product.create({ ...restProduct });
    const newProduct = clearRes(product.toObject());
    res.status(201).json({ product: newProduct });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError)
      return res.status(400).json({ errorMessage: error.message });

    if (error.code === 11000)
      return res.status(400).json({ errorMessage: "Error al crear producto" });

    return res.status(500).json({ errorMessage: error.message });
  }
};
//unicamente Admin

exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    const newProduct = clearRes(product.toObject());
    res.status(201).json({ product: newProduct });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError)
      return res.status(400).json({ errorMessage: error.message });

    if (error.code === 11000)
      return res
        .status(400)
        .json({ errorMessage: "Error al actualizar producto" });

    return res.status(500).json({ errorMessage: error.message });
  }
};

//unicamente Admin
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndRemove(id);
    res.status(201).json({ successMessage: "Producto Borrado" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError)
      return res.status(400).json({ errorMessage: error.message });

    if (error.code === 11000)
      return res.status(400).json({ errorMessage: "Error al Borrar producto" });

    return res.status(500).json({ errorMessage: error.message });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find(null, {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    res.status(201).json({ products });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError)
      return res.status(400).json({ errorMessage: error.message });

    if (error.code === 11000)
      return res
        .status(400)
        .json({ errorMessage: "Error al encontrar productos" });

    return res.status(500).json({ errorMessage: error.message });
  }
};

exports.getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const newProduct = clearRes(product.toObject());
    res.status(201).json({ product: newProduct });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError)
      return res.status(400).json({ errorMessage: error.message });

    if (error.code === 11000)
      return res
        .status(400)
        .json({ errorMessage: "Error al encontrar productos" });

    return res.status(500).json({ errorMessage: error.message });
  }
};

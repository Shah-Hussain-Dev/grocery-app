import { Product } from "../../models/index.js";
import { sendSuccess, sendError } from "../../utils/index.js";

export const getAllProducts = async (req, reply) => {
  try {
    const products = await Product.find();
    return sendSuccess(reply, 200, "Products fetched successfully", products);
  } catch (error) {
    return sendError(reply, 500, "An error occurred", error);
  }
};

export const getProductByCategoryId = async (req, reply) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .exec();
    return sendSuccess(reply, 200, "Products fetched successfully", products);
  } catch (error) {
    return sendError(reply, 500, "An error occurred", error);
  }
};

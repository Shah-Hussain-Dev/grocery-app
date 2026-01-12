import { Category } from "../../models/index.js";
import { sendSuccess, sendError } from "../../utils/index.js";

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find();
    return sendSuccess(
      reply,
      200,
      "Categories fetched successfully",
      categories
    );
  } catch (error) {
    return sendError(reply, 500, "An error occurred", error);
  }
};

export const createCategory = async (req, reply) => {
  try {
    const { name, image } = req.body;
    const category = await Category.create({ name, image });
    return sendSuccess(reply, 201, "Category created successfully", category);
  } catch (error) {
    return sendError(reply, 500, "An error occurred", error);
  }
};

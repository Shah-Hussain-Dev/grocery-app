import { Category } from "../../models.js";

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find();
    return reply.status(200).send({
      status: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return reply.status(500).send({
      status: false,
      message: "An error occurred",
      error: error,
    });
  }
};

export const createCategory = async (req, reply) => {
  try {
    const { name, image } = req.body;
    const category = await Category.create({ name, image });
    return reply.status(201).send({
      status: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return reply.status(500).send({
      status: false,
      message: "An error occurred",
      error: error,
    });
  }
};

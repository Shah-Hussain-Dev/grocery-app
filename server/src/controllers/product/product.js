import { Product } from "../../models.js";

export const getAllProducts = async (req, reply) => {
  try {
    const products = await Product.find();
    return reply.status(200).send({
      status: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ status: false, message: "An error occurred", error: error });
  }
};

import { Customer, DeliveryPartner } from "../../models.js";
import jwt from "jsonwebtoken";
// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }
    const { accessToken, refreshToken } = generateTokens(customer);
    reply.status(200).send({
      message: "Login Success",
      accessToken,
      refreshToken,
      data: customer,
      status: true,
    });
  } catch (error) {
    reply
      .status(500)
      .send({ message: "An Error Occurred", error: error, status: false });
  }
};

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    // db query to find the delivery partner
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return reply.status(404).send({
        message: "Delivery Partner not found",
        status: false,
      });
    }
    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return reply.status(401).send({
        status: false,
        message: "Invalid Credentials",
      });
    }
    const { accessToken, refreshToken } = generateTokens(deliveryPartner);
    return reply.status(200).send({
      status: true,
      message: "Login Successfull",
      accessToken,
      refreshToken,
      data: deliveryPartner,
    });
  } catch (error) {
    reply
      .status(500)
      .send({ message: "An Error Occurred", error: error, status: false });
  }
};

export const refreshToken = async (req, reply) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return reply.status(401).send({
        status: false,
        message: "Refresh Token is missing",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(403).send({
        status: false,
        message: "Invalid Role",
      });
    }
    if (!user) {
      return reply.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    return reply.status(200).send({
      status: true,
      message: "Refresh Token Successfull",
      accessToken,
      refreshToken: newRefreshToken,
      data: user,
    });
  } catch (error) {
    reply
      .status(500)
      .send({ message: "An Error Occurred", error: error, status: false });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.body;
    let user;
    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return reply.status(403).send({
        status: false,
        message: "Invalid Role",
      });
    }
    if (!user) {
      return reply.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    return reply.status(200).send({
      status: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "An Error Occurred",
      error: error,
      status: false,
    });
  }
};

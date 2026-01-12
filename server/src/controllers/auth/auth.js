import { Customer, DeliveryPartner } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../../utils/index.js";

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
    return sendSuccess(reply, 200, "Login Success", {
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    return sendError(reply, 500, "An Error Occurred", error);
  }
};

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    // db query to find the delivery partner
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return sendError(reply, 404, "Delivery Partner not found");
    }
    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return sendError(reply, 401, "Invalid Credentials");
    }
    const { accessToken, refreshToken } = generateTokens(deliveryPartner);
    return sendSuccess(reply, 200, "Login Successfull", {
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return sendError(reply, 500, "An Error Occurred", error);
  }
};

export const refreshToken = async (req, reply) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(reply, 401, "Refresh Token is missing");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return sendError(reply, 403, "Invalid Role");
    }
    if (!user) {
      return sendError(reply, 404, "User not found");
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    return sendSuccess(reply, 200, "Refresh Token Successfull", {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  } catch (error) {
    return sendError(reply, 500, "An Error Occurred", error);
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
      return sendError(reply, 403, "Invalid Role");
    }
    if (!user) {
      return sendError(reply, 404, "User not found");
    }
    return sendSuccess(reply, 200, "User found", user);
  } catch (error) {
    return sendError(reply, 500, "An Error Occurred", error);
  }
};

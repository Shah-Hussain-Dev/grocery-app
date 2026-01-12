import { Customer ,DeliveryPartner} from "../../models/index.js";
import { sendSuccess, sendError } from "../../utils/index.js";

export const updateUser = async (req, reply) => {
    try {
        const { userId } = req.user;
        const updateData = req.body;
        let UserModel;
        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);
        if (!user) {
            return sendError(reply, 404, "User not found");
        }

        if (user.role === "Customer") {
            UserModel = Customer;
        } else if (user.role === "DeliveryPartner") {
            UserModel = DeliveryPartner;
        } else {
            return sendError(reply, 400, "Invalid user role");
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
        return sendSuccess(reply, 200, "User updated successfully", updatedUser);
    } catch (error) {
        return sendError(reply, 500, "An error occurred", error);
    }
}
import { Customer } from "../../models/customer/customer.js";
import { DeliveryPartner } from "../../models/deliveryPartner/deliveryPartner.js";

export const updateUser = async (req, reply) => {
    try {
        const { userId } = req.user;
        const updateData = req.body;
        let UserModel;
        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);
        if (!user) {
            return reply.status(404).send({
                status: false,
                message: "User not found"
            })
        }

        if (user.role === "Customer") {
            UserModel = Customer;
        } else if (user.role === "DeliveryPartner") {
            UserModel = DeliveryPartner;
        } else {
            return reply.status(400).send({
                status: false,
                message: "Invalid user role"
            })
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
        return reply.status(200).send({
            status: true,
            message: "User updated successfully",
            data: updatedUser
        })
    } catch (error) {
        return reply.status(500).send({
            status: false,
            message: "An error occurred",
            error: error
        })
    }
}
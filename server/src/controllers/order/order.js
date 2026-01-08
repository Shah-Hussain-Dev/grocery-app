import { Customer, DeliveryPartner } from "../models/user.js";
import Branch from "../models/branch.js";
export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;


        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch)
        if (!customerData) {
            return reply.status(404).send({
                status: false,
                message: "Customer not found"
            })
        }
        if (!branchData) {
            return reply.status(404).send({
                status: false,
                message: "Branch Not Found!"
            })
        }

        const newOrder = await Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.countr
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "No address available"
            },
            pickupLocation: {
                latitude: branchData.liveLocation.latitude,
                longitude: branchData.liveLocation.longitude,
                address: branchData.address || "No address available"
            }
        })
        const savedOrder = await newOrder.save();
        return reply.status(200).send({
            status: true,
            message: "Order Created Successfully.",
            data: savedOrder
        })


    } catch (error) {
        return reply.status(500).send({
            status: false,
            message: "Failed to create order",
            error: error.message
        })
    }
}

export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body;

        // find the delivery Person in the database
        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return reply.status(404).send({
                status: false,
                message: "Delivery Person not found",
            })
        }

        const orderData = await Order.findById(orderId)
        if (!orderData) {
            return reply.status(404).send({ status: false, message: "Order not found." })
        }


    } catch (error) {
        return reply.status(500).send({
            status: false,
            message: "An Error Occured",
            error: error
        })
    }
}
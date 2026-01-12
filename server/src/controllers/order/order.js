import { Customer, DeliveryPartner,Branch } from "../../models/index.js";

import { ORDER_STATUS, sendSuccess, sendError } from "../../utils/index.js";
export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;
        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch)
        if (!customerData) {
            return sendError(reply, 404, "Customer not found");
        }
        if (!branchData) {
            return sendError(reply, 404, "Branch Not Found!");
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
        return sendSuccess(reply, 200, "Order Created Successfully.", savedOrder);


    } catch (error) {
        return sendError(reply, 500, "Failed to create order", error.message);
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
            return sendError(reply, 404, "Delivery Person not found");
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return sendError(reply, 404, "Order not found.");
        }

        if(order.status!=="available"){
            return sendError(reply, 400, "Order is not available for confirmation");
        }

        order.status = "confirmed"
        order.deliveryPartner = userId;
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation?.latitude,
            longitude: deliveryPersonLocation?.longitude,
            address: deliveryPersonLocation?.address || "No address available"
        };
        
        req.server.io.to(orderId).emit("orderConfirmed", order);
        const updatedOrder = await order.save();
        return sendSuccess(reply, 200, "Order Confirmed Successfully.", updatedOrder);

    } catch (error) {
        return sendError(reply, 500, "An Error Occured", error);
    }
}

export const updateOrderStatus = async(req,reply)=>{
    try {
        const {orderId} = req.params;
        const {status, deliveryPersonLocation} = req.body;
        const{userId} = req.user;

        const deliveryPerson = await DeliveryPartner.findById(userId);
        if(!deliveryPerson){
            return sendError(reply, 404, "Delivery Person not found");
        }
        const order = await Order.findById(orderId);
        if(!orderId){
            return sendError(reply, 404, "Order not found");
        }

        if(ORDER_STATUS.includes(order.status)){
            return sendError(reply, 400, "Order cannnot be changed");
        }

        if(order.deliveryPartner.toString() !==userId){
            return sendError(reply, 403, "Unauthorised access");
        }

        order.status = status;
        order.deliveryPersonLocation = deliveryPersonLocation;
        await order.save();
        req.server.io.to(orderId).emit("liveTrackingUpdates",order);
        
        return sendSuccess(reply, 200, "Order Updated Successfully.", order);
       
    } catch (error) {
        return sendError(reply, 500, "An Error Occured", error);
    }
}

export const getOrders = async(req,reply)=>{
    try {
            const {status,customerId,deliveryPartnerId,branchId} =req.params
            let query = {}
            if(status){
                query.status = status;
            }

            if(customerId){
                query.customer = customerId;
            }

            if(deliveryPartnerId && branchId){
                query.deliveryPartner = deliveryPartnerId;
                query.branch = branchId;
                
            }

            const orders = await Order.find(query).populate(
                "customer branch items.item deliveryPartner"
            )

            return sendSuccess(reply,200,"Order Fetched Successfully.",orders)

    } catch (error) {
        return sendError(reply,500,"An Error Occured.",errorr)
    }
}

export const getOrderById = async(req,reply)=>{
    try {
        const {orderId} = req.params;
        const order = await Order.findById(orderId).populate("customer branch items.item deliveryPartner");
        if(!order){
            return sendError(reply,404,"Order not found.")
        }

        return sendSuccess(reply,200,"Order fetch successfully",order)
    } catch (error) {
        return sendError(reply,500,"An Error Occured",error)
    }
}
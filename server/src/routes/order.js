import { confirmOrder,createOrder,getOrders,getOrderById,updateOrderStatus } from "../controllers/order/order.js";

import { verifyToken } from "../middlewares/auth.js";
import { sendError } from "../utils/index.js";

export const orderRoutes = async(fastify,option)=>{
    // Check token using hook (middleware)
    fastify.addHook("preHandler",async(request,reply)=>{
        const isAuthenticated = await verifyToken(request,reply);
        if(!isAuthenticated){
            return sendError(reply,401,"UnAuthorized access")
        }
    })

    // order routes
    fastify.post("/order",createOrder);
    fastify.get("/order",getOrders)
    fastify.get("/order/:orderId/status",updateOrderStatus)
    fastify.get("/order/:orderId/confirm",confirmOrder)
    fastify.get("/order/:orderId",getOrderById)


}
import { sendError } from "../utils/index.js"
import jwt from "jsonwebtoken";
export const verifyToken = async (req,reply) => {
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return sendError(reply,401,"Access token required")
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded
        return true

    } catch (error) {
        return sendError(reply,403,"Invalid or expired token",error)
    }
}


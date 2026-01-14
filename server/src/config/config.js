import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

export const PORT = process.env.PORT || 8000;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const envPassword = process.env.COOKIE_PASSWORD;
export const COOKIE_PASSWORD = (envPassword && envPassword.length >= 32) ? envPassword : "my-default-secret-password-12345678901234567890";
export const NODE_ENV = process.env.NODE_ENV;






export const MongoStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoStore({
    uri: MONGO_URI,
    collection: "sessions"
});

sessionStore.on('error', (error) => {
    console.log("Session store error", error);
});

export const authenticate = async (email, password) => {
    // if (email === "admin@example.com" && password === "admin@1234") {
    //     return Promise.resolve({ email, password });
    // } else {
    //     return null;
    // }

    if(email && password){
        const user = await Admin.findOne({email});
        if(!user){
            return null
        }
        if(user.password === password){
            return Promise.resolve({email,password})
        }else{
            return null
        }

    }
    return null
};

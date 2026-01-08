import "dotenv/config";
import { MONGO_URI, PORT } from "./src/config/config.js";
import fastify from "fastify";
import connectDB from "./src/config/connectDB.js";
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    const app = fastify();
    app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) throw err;
      console.log(`Server listening at ${address} : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

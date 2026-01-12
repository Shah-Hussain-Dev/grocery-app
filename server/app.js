import "dotenv/config";
import { MONGO_URI, PORT } from "./src/config/config.js";
import fastify from "fastify";
import connectDB from "./src/config/connectDB.js";
import fastifySocketIO from "fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    const app = fastify();

    app.register(fastifySocketIO, {
      cors: {
        origin: "*"
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ["websocket"]
    });

    await registerRoutes(app);
    app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) throw err;
      console.log(`Server listening at ${address} : ${PORT}`);
    });


    app.ready().then(()=>{
      app.io.on("connection",(socket)=>{
        console.log("User connected")

        socket.on("joinRoom",(orderId)=>{
          socket.join(orderId);
          console.log("User joined room",orderId)
        })

        socket.on("disconnect",()=>{
          console.log("User Disconnected")
        })
      })
    })
  } catch (error) {
    console.log(error);
  }
};

startServer();

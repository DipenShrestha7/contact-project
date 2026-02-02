import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./config/db.js";
import AuthenticateContactRoutes from "./routes/AuthenticateContactRoute.js";
import path from "path";
import multipart from "@fastify/multipart";
import Static from "@fastify/static";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
});
await fastify.register(multipart);

fastify.register(Static, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

fastify.register(AuthenticateContactRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    fastify.log.info("Database connected and synchronized");

    const PORT = process.env.PORT || 5001;
    await fastify.listen({ port: PORT });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

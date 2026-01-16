import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./config/db.js";
import AuthenticateContactRoutes from "./routes/AuthenticateContactRoute.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(AuthenticateContactRoutes, { prefix: "/api" });

fastify.register(cors, {
  origin: "*",
});

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

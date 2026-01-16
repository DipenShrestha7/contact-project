import ContactModel from "../models/ContactModel.js";

function AuthenticateContactRoute(fastify) {
  //POST Contact Details
  fastify.post("/contact", async (req, reply) => {
    const { name, phone, email, address, facebook, instagram, image } =
      req.body;
    try {
      const contact = await ContactModel.create({
        name,
        phone,
        email,
        address,
        facebook,
        instagram,
        image,
      });
      reply.status(201).send(contact);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: error.message });
    }
  });

  //GET Contact Details
  fastify.get("/contact", async (req, reply) => {
    try {
      const contacts = await ContactModel.findAll();

      return { message: "Contacts retrieved", contacts: contacts };
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: error.message });
    }
  });
}

export default AuthenticateContactRoute;

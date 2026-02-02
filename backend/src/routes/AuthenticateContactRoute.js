import ContactModel from "../models/ContactModel.js";
import path from "path";
import pump from "pump";
import fs from "fs";

function AuthenticateContactRoute(fastify) {
  //POST Contact Details
  fastify.post("/contact", async (req, reply) => {
    const parts = req.parts();
    let fields = {};
    let uploadedFile = null;

    for await (const part of parts) {
      if (part.file) {
        const filename = Date.now() + "_" + part.filename;
        const filePath = path.join("uploads", filename);

        await pump(part.file, fs.createWriteStream(filePath));
        uploadedFile = `/uploads/${filename}`;
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    try {
      const contact = await ContactModel.create({
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        address: fields.address,
        facebook: fields.facebook,
        instagram: fields.instagram,
        favorite: false,
        image: uploadedFile,
      });

      reply.code(201).send(contact);
    } catch (error) {
      reply.code(500).send({ error: error.errors });
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

  //GET One Contact Detail
  fastify.get("/contact/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const contact = await ContactModel.findOne({ where: { id: id } });
      return { message: "Contact retrieved", contact: contact };
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: error.message });
    }
  });

  //DELETE Contact Details
  fastify.delete("/contact/:id", async (req, reply) => {
    const { id } = req.params;

    try {
      await ContactModel.destroy({ where: { id: id } });
      return { message: "Contact deleted successfully" };
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: error.message });
    }
  });

  //UPDATE Contact Details
  fastify.put("/contact", async (req, reply) => {
    const parts = req.parts();
    let fields = {};
    let uploadedFile = null;

    for await (const part of parts) {
      if (part.file) {
        const filename = Date.now() + "_" + part.filename;
        const filePath = path.join("uploads", filename);

        await pump(part.file, fs.createWriteStream(filePath));
        uploadedFile = `/uploads/${filename}`;
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    try {
      const id = Number(fields.id);
      const contact = await ContactModel.update(
        {
          name: fields.name,
          phone: fields.phone,
          email: fields.email,
          address: fields.address,
          facebook: fields.facebook,
          instagram: fields.instagram,
          favorite: fields.favorite,
          image: uploadedFile,
        },
        { where: { id } },
      );
      reply.code(201).send(contact);
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: error.message });
    }
  });
}

export default AuthenticateContactRoute;

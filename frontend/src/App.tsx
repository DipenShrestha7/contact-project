import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import reactLogo from "./assets/react.svg";
type ContactForm = {
  id?: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  favorite: boolean;
  image: File | null;
};

type StoredContact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  favorite: boolean;
  image?: string;
};

export default function App() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    favorite: false,
    image: null,
  });

  const [contacts, setContacts] = useState<StoredContact[]>([]);
  useEffect(() => {
    document.title = "Contact Manager";

    const fetchData = async () => {
      const response = await fetch("http://localhost:5001/api/contact");
      const data = await response.json();
      console.log(data.contacts);
      setContacts(data.contacts);
    };
    fetchData();
  }, []);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      facebook: "",
      instagram: "",
      favorite: false,
      image: null,
    });
    setEditingIndex(null);
  };

  const submitForm = async () => {
    if (editingIndex !== null) {
      const updatedContact: StoredContact = {
        ...contacts[editingIndex],
        ...form,
        image: form.image
          ? URL.createObjectURL(form.image)
          : contacts[editingIndex].image,
      };

      const updatedContacts = [...contacts];
      updatedContacts[editingIndex] = updatedContact;

      const formData = new FormData();
      if (form.id !== undefined) {
        formData.append("id", String(form.id));
      }
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("facebook", form.facebook);
      formData.append("instagram", form.instagram);
      if (form.image) {
        formData.append("image", form.image);
      }
      try {
        const response = await fetch(`http://localhost:5001/api/contact`, {
          method: "PUT",
          body: formData,
        });

        const savedContact = await response.json();

        console.log("Contact added successfully");
        console.log(savedContact);
        resetForm();
      } catch (error) {
        console.error("Failed to update contact:", error);
      }
      resetForm();
      setContacts(updatedContacts);
    } else {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("facebook", form.facebook);
      formData.append("instagram", form.instagram);
      if (form.image) {
        formData.append("image", form.image);
      }
      try {
        const response = await fetch("http://localhost:5001/api/contact", {
          method: "POST",
          body: formData,
        });

        const savedContact = await response.json();

        // Add to state only after successful POST
        setContacts((prev) => [...prev, savedContact]);
        console.log("Contact added successfully");
        console.log(savedContact);
        resetForm();
      } catch (error) {
        console.error("Failed to add contact:", error);
      }
      resetForm();
    }
  };

  const startEdit = (index: number) => {
    const contact = contacts[index];

    setForm({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      facebook: contact.facebook,
      instagram: contact.instagram,
      favorite: contact.favorite,
      image: null,
    });
    setEditingIndex(index);
  };

  const toggleFavorite = (index: number) => {
    setContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, favorite: !contact.favorite } : contact,
      ),
    );
  };

  const deleteContact = async (index: number, id: number) => {
    const response = await fetch(`http://localhost:5001/api/contact/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data.message);
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Contact Manager
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* FORM */}
        <div className="bg-gray-900 px-6 py-4 rounded-2xl shadow-lg border border-gray-800 flex-1">
          <h2 className="text-2xl font-semibold mb-4">
            {editingIndex !== null ? "Edit Contact" : "Add Contact"}
          </h2>

          <div className="space-y-4">
            <div className="space-y-4">
              {/* NAME */}
              <div className="flex flex-row justify-center items-center gap-2">
                <h1 className="w-28 text-center">Name</h1>
                <input
                  className="w-full bg-gray-800 p-3 rounded-xl"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* PHONE */}
              <div className="flex flex-row justify-center items-center gap-2">
                <h1 className="w-28 text-center">Phone</h1>
                <input
                  className="w-full bg-gray-800 p-3 rounded-xl"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-row justify-center items-center gap-2">
                <h1 className="w-28 text-center">Email</h1>
                <input
                  className="w-full bg-gray-800 p-3 rounded-xl"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* ADDRESS */}
              <div className="flex flex-row justify-center items-center gap-2">
                <h1 className="w-28 text-center">Address</h1>
                <input
                  className="w-full bg-gray-800 p-3 rounded-xl"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              {/* FACEBOOK */}
              <div className="flex flex-row justify-center items-center gap-2">
                <h1 className="w-28 text-center">Facebook</h1>
                <input
                  className="w-full bg-gray-800 p-3 rounded-xl"
                  value={form.facebook}
                  onChange={(e) =>
                    setForm({ ...form, facebook: e.target.value })
                  }
                />
              </div>

              {/* INSTAGRAM */}
              <div className="flex flex-row justify-center items-center gap-2">
                <h1 className="w-28 text-center">Instagram</h1>
                <input
                  className="w-full bg-gray-800 p-3 rounded-xl"
                  value={form.instagram}
                  onChange={(e) =>
                    setForm({ ...form, instagram: e.target.value })
                  }
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <input
              type="file"
              className="w-full bg-gray-800 p-3 rounded-xl"
              onChange={handleImage}
            />

            {form.image && (
              <img
                src={URL.createObjectURL(form.image)}
                className="w-24 h-24 rounded-full object-cover mx-auto mt-3 shadow-lg"
              />
            )}

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl text-white font-semibold"
                onClick={submitForm}
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>

              {editingIndex !== null && (
                <button
                  className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-xl text-white"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CONTACT LIST */}
        <div className="flex-1 space-y-5">
          {contacts.length === 0 && (
            <p className="text-gray-500 text-center">No contacts added yet.</p>
          )}

          {contacts.map((c, index) => (
            <div
              key={index}
              className="bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-800 flex items-center gap-5"
            >
              <img
                src={c.image ? `http://localhost:5001${c.image}` : reactLogo}
                className="w-16 h-16 rounded-xl object-cover border border-gray-700"
              />

              <div className="flex-1 space-y-1">
                <div className="text-xl font-semibold">{c.name}</div>

                <div className="flex flex-row gap-3">
                  <div className="text-gray-400 flex flex-row gap-1 items-center">
                    <Phone size={16} />
                    {c.phone}
                  </div>

                  {c.email && (
                    <div className="text-gray-400 text-sm flex flex-row gap-1 items-center">
                      <Mail size={16} /> {c.email}
                    </div>
                  )}
                </div>

                {c.address && (
                  <div className="text-gray-400 text-sm flex flex-row gap-1 items-center">
                    <MapPin size={16} /> {c.address}
                  </div>
                )}

                <div className="flex flex-row gap-2">
                  {c.facebook && (
                    <div className="text-gray-400 text-sm flex flex-row gap-1 items-center">
                      <SiFacebook size={16} /> {c.facebook}
                    </div>
                  )}

                  {c.instagram && (
                    <div className="text-gray-400 text-sm flex flex-row gap-1 items-center">
                      <SiInstagram size={16} /> {c.instagram}
                    </div>
                  )}
                </div>
              </div>

              {/* BUTTONS COLUMN */}
              <div className="flex flex-row gap-2 items-center">
                <button
                  onClick={() => toggleFavorite(index)}
                  className={`h-12 w-12 px-4 py-2 rounded-xl text-lg ${
                    c.favorite
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  ★
                </button>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => startEdit(index)}
                    className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteContact(index, c.id)}
                    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

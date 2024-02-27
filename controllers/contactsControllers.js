import Contact from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";
//import contactsService from "../services/contactsServices.js";
// import {
//   getAllContacts,
//   getOneContact,
//   deleteContact,
//   createContact,
//   updateContact,
//   updateContactFavorite,
// } from "../services/contactsServices.js";

async function getAllContacts(req, res, next) {
  try {
    const result = await Contact.find();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}
async function getOneContact(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findById(id);
    if (result === null) {
      throw HttpError(404);
    }
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      throw HttpError(404, "Contact is not found");
    }
    res.json({ message: `contact ${id} is deleted` });
  } catch (error) {
    next(error);
  }
}

// async function createContact(req, res, next) {
//   const result = await Contact.create(req.body);
//   res.status(201).json(result);
// }

async function createContact(req, res, next) {
  const contact = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };
  try {
    const newContact = await Contact.create(contact);
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

// const updateContact = async (req, res) => {
//   const { id } = req.params;
//   const contactToUpdate = await contactsService.getContactById(id);

//   if (!contactToUpdate) {
//     throw HttpError(404, "Not found");
//   }
//   const updatedContact = Object.assign(contactToUpdate, req.body);
//   const result = await contactsService.updateById(id, updatedContact);
//   res.status(200).json(result);
// };
async function updateContact(req, res, next) {
  const { id } = req.params;
  try {
    const contactToUpdate = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!contactToUpdate) {
      throw HttpError(404, "Contact is not found");
    }
    res.status(200).json(contactToUpdate);
  } catch (error) {
    next(error);
  }
}

async function updateFavorite(req, res, next) {
  const { id } = req.params;
  try {
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw HttpError(404, "Contact is not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
};

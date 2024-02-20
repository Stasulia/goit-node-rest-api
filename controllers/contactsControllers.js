const { HttpError } = require("../helpers/HttpError.js");
const contactsService = require("../services/contactsServices.js");

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contactToUpdate = await contactsService.getContactById(id);

  if (!contactToUpdate) {
    throw HttpError(404, "Not found");
  }
  const updatedContact = Object.assign(contactToUpdate, req.body);
  const result = await contactsService.updateById(id, updatedContact);
  res.status(200).json(result);
};

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};

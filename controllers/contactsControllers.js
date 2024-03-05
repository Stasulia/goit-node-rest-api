import Contact from "../models/contacts.js";
import HttpError from "../helpers/HttpError.js";

async function getAllContacts(req, res, next) {
  const { _id: owner } = req.user;
  //const { page = 1, limit = 10} = req.query;
  //const skip = (page - 1) * limit;
  try {
    //const result = await Contact.find({ owner }, { skip, limit });
    const result = await Contact.find({ owner });
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
      throw HttpError(404, "Contact is not found");
    }
    if (result.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact is not found");
    }
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id, { owner });
    if (!deletedContact) {
      throw HttpError(404, "Contact is not found");
    }
    res.json({ message: `contact ${id} is deleted` });
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  const { _id: owner } = req.user;
  try {
    const newContact = await Contact.create({ ...req.body, owner });
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}
async function updateContact(req, res, next) {
  const { id } = req.params;
  try {
    const contactToUpdate = await Contact.findByIdAndUpdate(
      id,
      { owner },
      req.body,
      {
        new: true,
      }
    );
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
    const result = await Contact.findByIdAndUpdate(id, { owner }, req.body, {
      new: true,
    });
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

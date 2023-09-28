const fs = require('fs').promises;
const uuid = require('uuid').v4;

const listContacts = async () => {
  try {
    const contactsDB = await fs.readFile('contacts.json', 'utf-8');
    const contacts = JSON.parse(contactsDB);
    return contacts;
  } catch (err) {
    throw err;
  }
};

const getContactById = async (contactId) => {
  try {
    const contactsDB = await fs.readFile('contacts.json', 'utf-8');
    const contacts = JSON.parse(contactsDB);
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      return null;
    }
    return contact;
  } catch (err) {
    throw err;
  }
};

const removeContact = async (contactId) => {
  try {
    const contactsDB = await fs.readFile('contacts.json', 'utf-8');
    let contacts = JSON.parse(contactsDB);
    const contactIndex = contacts.findIndex((c) => c.id === contactId);
    if (contactIndex === -1) {
      return false;
    }
    contacts = contacts.filter((c) => c.id !== contactId);
    await fs.writeFile('contacts.json', JSON.stringify(contacts));
    return true;
  } catch (err) {
    throw err;
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return null;
    }

    const contactsDB = await fs.readFile('contacts.json', 'utf-8');
    let contacts = JSON.parse(contactsDB);
    const newContact = {
      id: uuid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile('contacts.json', JSON.stringify(contacts));
    return newContact;
  } catch (err) {
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contactsDB = await fs.readFile('contacts.json', 'utf-8');
    let contacts = JSON.parse(contactsDB);
    const contactIndex = contacts.findIndex((c) => c.id === contactId);
    if (contactIndex === -1) {
      return null;
    }
    const updatedContact = { ...contacts[contactIndex], ...body };
    contacts[contactIndex] = updatedContact;
    await fs.writeFile('contacts.json', JSON.stringify(contacts));
    return updatedContact;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

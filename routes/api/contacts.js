const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid'); 

const { createUserDataValidator } = require('../../utils/userValidators');

const readContacts = async () => {
  try {
    const data = await fs.readFile('contacts.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeContacts = async (data) => {
  await fs.writeFile('contacts.json', JSON.stringify(data, null, 2), 'utf8');
};

router.get('/', async (req, res) => {
  const contacts = await readContacts();
  res.status(200).json( contacts );
});

router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const contacts = await readContacts();
  const contact = contacts.find((c) => c.id === contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json( contact );
});

router.post('/', async (req, res) => {
  const validationResult = createUserDataValidator(req.body);

  if (validationResult.messages) {
    return res.status(400).json({ messages: validationResult.messages });
  }

  const { name, email, phone } = req.body;
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  const contacts = await readContacts();
  contacts.push(newContact);

  await writeContacts(contacts);

  res.status(201).json(newContact);
});



router.delete('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const contacts = await readContacts();
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  contacts.splice(index, 1);

  await writeContacts(contacts);

  res.status(200).json({ message: 'Contact deleted' });
});

router.put('/:contactId', express.json(), async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const contacts = await readContacts();
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const missingFields = [];

  if (!name) {
    missingFields.push('name');
  }
  if (!email) {
    missingFields.push('email');
  }
  if (!phone) {
    missingFields.push('phone');
  }

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required ${missingFields.join(', ')} fields` });
  }

  const validationResult = createUserDataValidator(req.body);

  if (validationResult.messages && validationResult.messages.length > 0) {
    return res.status(400).json({ messages: validationResult.messages });
  }

  if (name) contacts[index].name = name;
  if (email) contacts[index].email = email;
  if (phone) contacts[index].phone = phone;

  await writeContacts(contacts);

  res.status(200).json(contacts[index]);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 

let contacts = [];

router.get('/', (req, res) => {
  res.status(200).json({ contacts });
});

router.get('/:contactId', (req, res) => {
  const { contactId } = req.params;
  const contact = contacts.find((c) => c.id === contactId);

  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json({ contact });
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  res.status(201).json({ contact: newContact });
});

router.delete('/:contactId', (req, res) => {
  const { contactId } = req.params;
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  contacts.splice(index, 1);
  res.status(200).json({ message: 'Contact deleted' });
});

router.put('/:contactId', (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (!name && !email && !phone) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  if (name) contacts[index].name = name;
  if (email) contacts[index].email = email;
  if (phone) contacts[index].phone = phone;

  res.status(200).json({ contact: contacts[index] });
});

module.exports = router;

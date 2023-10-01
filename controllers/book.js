const m = require('../models');

function create(req, res) {
  const { name, status } = req.body;

  // Check for duplicate book names
  m.Book.findOne({ where: { name } })
    .then(existingBook => {
      if (existingBook) {
        return res.status(400).json({ error: 'Book already exists' });
      }

      // Check for special characters in the book name
      const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;
      if (specialCharacterRegex.test(name)) {
        return res.status(400).json({ error: 'Book name contains special characters' });
      }

      // If all checks pass, create the book
      m.Book.create({
        status,
        name,
      })
        .then(data => {
          res.json({ data });
        })
        .catch(error => {
          res.status(500).json({ error: 'Error creating book', details: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: 'Error checking for existing book', details: error });
    });
}

module.exports = { index, create };

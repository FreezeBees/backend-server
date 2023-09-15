const m = require('../models');

function index(req, res) {
  m.Book.findAll()
    .then(data => {
      res.json({ data });
    });
}

function create(req, res) {
  const { name, status } = req.body;
  m.Book.create({
    status,
    name,
  })
    .then(data => {
      res.json({ data });
    });
}

module.exports = { index, create };

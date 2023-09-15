const m = require('../models');

function index(req, res) {
  res.json({ message: 'Its Alive' });
}

async function staticdata(req, res) {
  try {
    const data = {};
    data.role = await m.Role.findAll({ attributes: ['id', 'name'] });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
}

function testdata(req, res) {
  res.json({token: req.body.token});
}

async function qr(req, res) {
  console.log(req.user.id);
  console.log('scanned', req.user.name);
  const jane = await m.Scan.create({ name: req.user.name, StudentId: req.user.StudentId, residence: 'hostel', scannedAt: new Date()});
  console.log("Jane's auto-generated ID:", jane.id);
  res.json({message: 'Success'});
}

async function getscans(req, res) {
  const allscan = await m.Scan.findAll();
  res.json({allscan});
}

module.exports = { index, staticdata, testdata, qr, getscans };

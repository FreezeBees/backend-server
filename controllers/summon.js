const axios = require('axios');
const m = require('../models');

async function showByStudentId(req, res) {
  console.log(req.params);
  try {
    let data = await m.Summon.findAll({ where: { StudentId: req.params.StudentId }, raw: true });
    data = await Promise.all(data.map(async ({ BillId, ...theRest }) => {
      const apiUrl = `https://www.billplz.com/api/v3/bills/${BillId}`;
      const response = await axios.get(apiUrl, { auth: { username: process.env.billplzapikey } });
      return { ...theRest, ...response.data };
    }));
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function create(req, res) {
  try {
    const { description, amount, StudentId } = req.body;
    const student = await m.User.findOne({ where: { StudentId } });
    const data = {
      collection_id: process.env.billplzcollectionid,
      description,
      email: student.email,
      name: student.name,
      amount: String(amount * 100),
      callback_url: 'http://example.com/webhook/',
      deliver: true,
    };
    const apiUrl = 'https://www.billplz.com/api/v3/bills';
    const response = await axios.post(apiUrl, data, { auth: { username: process.env.billplzapikey } });
    const summon = await m.Summon.create({ StudentId, BillId: response.data.id });
    res.json({ data: summon });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = { showByStudentId, create };

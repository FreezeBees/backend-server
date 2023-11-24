/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const m = require('../models');
const helper = require('../helper');

async function index(req, res) {
  const {
    where, page, perpage, Sequelize, offset, order,
  } = helper.queryParameters({ req, search_columns: ['name'] });

  try {
    const data = await m.Book.findAndCountAll({
      include:[
        {
          model: m.BookBorrow, include: [{ model: m.User }],
        },
        {
          model: m.BookFavourite,
        },
      ],
      where,
      limit: perpage,
      offset,
      ...order,
    });
    res.json({
      data: data.rows, page, perpage, total: data.count,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

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

const borrowBook = async (req, res) => {
  try {
    const { BookId, UserId } = req.body;
    const theBook = await m.Book.findOne({ where: { id: BookId }, include:[{ model: m.BookBorrow }] });
    console.log('hello', theBook.BookBorrows);
    const hasBorrower = !!theBook.BookBorrows.length;
    console.log(hasBorrower);
    if (hasBorrower && !theBook.BookBorrows[theBook.BookBorrows.length-1].dateReturnAt) return res.status(500).json({ error: 'Error book n/a for borrowing'});
    const data = await m.BookBorrow.create({ BookId, UserId, dateBorrowAt: new Date() });
    theBook.status = 'Not Available';
    await theBook.save();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: 'Error borrow Book for existing book', details: error });
  }
};

const returnBook = async (req, res) => {
  const { BookId, UserId } = req.body;
  try {
    const theBookBorrow = await m.BookBorrow.findOne({ where: { BookId, UserId }, order: [ [ 'id', 'DESC' ]] })
    theBookBorrow.dateReturnAt = new Date();
    theBookBorrow.save();
    const theBook = await m.Book.findOne({ where: { id: BookId } })
    theBook.status = 'Available'
    await theBook.save()
    res.json({ data: theBookBorrow });
  } catch (error) {
    res.status(500).json({ error: 'Error return Book for existing book', details: error })
  }
};

const favouriteBook = async (req, res) => {
  try {
    const { BookId, UserId } = req.body;
    const data = await m.BookFavourite.findOrCreate({ where: {BookId, UserId} })
    if (!data[1]) await m.BookFavourite.destroy({ where: {BookId, UserId} })
    console.log(data);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: 'Error borrow Book for existing book', details: error })
  }
};

// const getFavouriteBook = async (req, res) => {
//   const { id: UserId } = req.user; // Assuming StudentId is passed as a route parameter
//   try {
//     // const user = await m.User.findOne({})
//     const favoriteBooks = await m.BookFavourite.findAll({
//       where: { UserId },
//       // raw: true,
//       include: [{ model: m.Book }],
//     });

//     res.json({ data: favoriteBooks });
//   } catch (error) {
//     res.status(500).json({ error: 'Error getting favorite books for the student', details: error });
//   }
// };

const getFavouriteBook = async (req, res) => {
  const { id: UserId } = req.user;
  try {
    const favoriteBooks = await m.BookFavourite.findAll({
      where: { UserId },
      include: [{ model: m.Book }],
      order: [['createdAt', 'ASC']], // You can change 'createdAt' to the actual timestamp field
    });

    res.json({ data: favoriteBooks });
  } catch (error) {
    res.status(500).json({ error: 'Error getting favorite books for the student', details: error });
  }
};


module.exports = {
  index, create, borrowBook, returnBook, favouriteBook, getFavouriteBook,
};

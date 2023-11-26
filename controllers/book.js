/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const m = require('../models');
const helper = require('../helper');
const { uploadFile } = require('../driver/googleDrive');
const svc = require('../services');
// const sendMailAvailableBook = require('../services/sendMailAvailableBook');

async function index(req, res) {
  const {
    where, page, perpage, Sequelize, offset, order,
  } = helper.queryParameters({ req, search_columns: ['name'] });

  try {
    const data = await m.Book.findAndCountAll({
      include: [
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

async function create(req, res) {
  const { name, status } = req.body;
  const fileid = await uploadFile(req.files[0]);
  console.log(req.body, req.files[0]);

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
        image: fileid,
      })
        .then(data => {
          console.log('databuku:', data);
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
    let { BookId, UserId, StudentId } = req.body;
    if (StudentId) {
      UserId = (await m.User.findOne({ where: { StudentId } })).id;
    }
    const theBook = await m.Book.findOne({
      where: { id: BookId },
      include: [{ model: m.BookBorrow }],
    });
    console.log(req.body);

    console.log('Book Information:', theBook);

    if (theBook.BookBorrows.length > 0 && !theBook.BookBorrows[theBook.BookBorrows.length - 1].dateReturnAt) {
      return res.status(500).json({ error: 'Error: Book not available for borrowing' });
    }

    await m.BookBorrow.create({ BookId, UserId, dateBorrowAt: new Date() });

    theBook.status = 'Not Available';
    await theBook.save();

    res.json({
      data: 'success',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error borrowing Book for existing book', details: error });
  }
};

const returnBook = async (req, res) => {
  const { BookId, UserId } = req.body;
  try {
    // Retrieve the latest borrow record for the specific book and user
    const theBookBorrow = await m.BookBorrow.findOne({
      where: { BookId, UserId },
      order: [['id', 'DESC']],
    });

    // Update the return date for the latest borrow record
    theBookBorrow.dateReturnAt = new Date();
    await theBookBorrow.save();

    // Retrieve the book based on the provided BookId
    const theBook = await m.Book.findOne({ where: { id: BookId } });

    // Update the book status to 'Available'
    theBook.status = 'Available';
    await theBook.save();

    // Get the list of users who have favorited this book
    const favoriteUsers = await m.BookFavourite.findAll({
      where: { BookId },
      include: [{ model: m.User }],
    });

    // Prepare an array of user emails for sending emails
    const usersWithEmails = favoriteUsers.map(favorite => ({ email: favorite.User.email }));

    // Send email to all favorite users
    for (const favorite of favoriteUsers) {
      const user = favorite.User;
      try {
        // Assuming svc.sendMailAvailableBook(user) is an asynchronous operation
        await svc.sendMailAvailableBook(user);
        console.log(`Email sent to user with ID ${user.id}`);
      } catch (error) {
        console.error(`Failed to send email to user with ID ${user.id}:`, error);
      }
    }

    // Send a single email to all favorite users
    await svc.sendMailAvailableBook(usersWithEmails);

    res.json({ data: theBookBorrow });
  } catch (error) {
    res.status(500).json({ error: 'Error returning Book for existing book', details: error });
  }
};

const favouriteBook = async (req, res) => {
  try {
    const { BookId, UserId } = req.body;
    const data = await m.BookFavourite.findOrCreate({ where: { BookId, UserId } });
    if (!data[1]) await m.BookFavourite.destroy({ where: { BookId, UserId } });
    console.log('body:', req.body);
    console.log(data);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: 'Error borrow Book for existing book', details: error });
  }
};

const getFavouriteBook = async (req, res) => {
  const { id: UserId } = req.user;
  try {
    const favoriteBooks = await m.BookFavourite.findAll({
      where: { UserId },
      include: [{ model: m.Book, 
        include: [
        {
          model: m.BookFavourite,
        },
      ] }],
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

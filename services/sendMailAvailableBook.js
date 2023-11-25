const nodemailer = require('nodemailer');

async function sendMailAvailableBook(users) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Iterate over each user and send an email
    for (const user of users) {
      const info = await transporter.sendMail({
        from: `"Bibliotech" <${process.env.MAIL_USERNAME}>`,
        to: user.email,
        subject: 'Your Book Available, Borrow Now!!',
        html: `
        <p>Dear ${user.name},</p>
        <p>We are excited to inform you that the book you favorited is now available for borrowing at Bibliotech. Don't miss the chance to read this fantastic book!</p>
        <p>Visit our library and borrow the book now. Happy reading!</p>
        <p>Best regards,<br>Bibliotech Support Team</p>`,
      });

      console.log(`Email sent to ${user.email}, MessageId: ${info.messageId}`);
    }

    return 'Emails sent successfully';
  } catch (error) {
    console.error('Failed to send emails:', error);
    throw error;
  }
}

module.exports = sendMailAvailableBook;

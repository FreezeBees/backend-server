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
          Best regards,<br><br>
          Bibliotech Support Team`,
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

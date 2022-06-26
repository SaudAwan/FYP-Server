const nodemailer = require('nodemailer');
const constants = require('../constant');

exports.isValidEmailAddress = (address) => {
  const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  return address.match(emailRegex);
}
const populateBookEventTemplate = (data) => {
  console.log(data)
  const temp = `
        <h2>You have successfully booked for the ${data.eventName}</h2>
        <p>
            Hello <b>${data.userName}</b>, This email is to confirm your booking for event ${data.eventName}, 
            We have attached a QR code with this email, this QR code will be used as your event receipt. Thank You.
        </p>
    `;
    return temp;
};

const populateGeneralTemplate = (body) => {
    
    if (!body) {
        throw new Error("Email body not provided");
    }

    return body;
  };



exports.sendMail = async (template, payload) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // secure: false, // true for 465, false for other ports
    secure: false,
    auth: {
      user: process.env.MAILING_AUTH_EMAIL,
      pass: process.env.MAILING_AUTH_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: `"Evenezy 🎤" <${process.env.MAILING_AUTH_EMAIL}>`,
    to: payload.to,
  };

  switch (template) {
    case constants.EMAIL_TEMPLATE.BOOK_EVENT_TEMPLATE:
      mailOptions = {
        ...mailOptions,
        subject: 'Booking Confirmation for Event',
        html: populateBookEventTemplate(payload),
        attachments: [{
          filename: 'image.png',
          path: payload.qrCode,
          cid: 'qrcode@evenzy.ee'
      }]
      };
      break;
    case constants.EMAIL_TEMPLATE.GENERIC_TEMPLATE:
        mailOptions = {
          ...mailOptions,
          subject: payload.title || 'Please Take a look here',
          html: populateGeneralTemplate(payload.body),
        };
        break;
    default:
      throw new Error('Email Template Not Found');
  }

  await transporter.sendMail(mailOptions);
};
const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");
const { BadRequestError } = require("../core/error.response");

function validateEmail(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await validate(email);

      const { valid, reason, validators } = response;

      if (!valid && reason && !validators[reason].valid) {
        throw new BadRequestError("Vui lòng cung cấp một địa chỉ email hợp lệ");
      }

      return {
        errors: null,
      };
    } catch (error) {
      reject(error);
    }
  });
}

async function sendEmailVerifyAccount(dataSend, options) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  try {
    // send mail with defined transport object
    const response = await transporter.sendMail({
      from: `"Website tin tức 👻" <${process.env.EMAIL_APP_USERNAME}>`, // sender address
      to: dataSend.sendToEmail, // list of receivers
      subject: options.subject, // Subject line
      html: options.handleHtmlLang,
    });

    if (response) {
      return {
        status: 201,
        errors: null,
        elements: dataSend.data,
        meta: {
          message: "Gửi e-mail thành công!",
        },
      };
    }
  } catch (error) {
    return {
      status: 500,
      errors: error,
      elements: null,
    };
  }
}

module.exports = {
  validateEmail,
  sendEmailVerifyAccount,
};

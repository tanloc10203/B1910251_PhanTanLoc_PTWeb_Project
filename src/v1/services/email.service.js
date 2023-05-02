const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");
const { BadRequestError } = require("../core/error.response");

const validator = require("validator");
const kickbox = require("kickbox")
  .client(
    "live_73006b9ba90fc062b1b180e198f122c04ec9afe164c41a378231aa411f52432f"
  )
  .kickbox();

function validateEmail(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await validate(email);

      const { valid, reason, validators } = response;

      if (!valid && reason && !validators[reason].valid) {
        console.log("error email:::", response);
        throw new BadRequestError("Vui lòng cung cấp một địa chỉ email hợp lệ");
      }

      resolve({
        errors: null,
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function checkEmail(email) {
  kickbox.verify(email, function (err, response) {
    if (response.body.result === "deliverable") {
      return true;
    } else {
      throw new BadRequestError("Vui lòng cung cấp một địa chỉ email hợp lệ");
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
  checkEmail,
  sendEmailVerifyAccount,
};

const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS,
  },
});

// Send the email
const sendMail = (email,name) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: 'Thank You For Contacting Me',
      html: `
            <div style="border: 1px solid #38BDF8; padding: 20px; border-radius: 5px; width:fit-content; margin: auto; background: #fff;">
                <h4 style="font-style: italic; color:#38BDF8;text-align: center;font-size: 23px;">&lt;IshakBenfredj /&gt;</h4>
                <div style="direction: rtl;">
                    <p>السلام عليكم <span style=font-weight:bold; color:#38BDF8; ">${name}</span></p>
                    <p>لقد تلقينا رسالتك , سنرد عليك عبر البريد الإلكتروني إن إستدعى الأمر</p>
                    <p>بارك الله فيك (:</p>
                </div>
            </div>
            `,
    },
    (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
};

module.exports = sendMail
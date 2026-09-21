const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sendEmail = async (email, subject, { text, html }) => {
  const params = {
    Source: `Test Team <${process.env.SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: text || "",
        },
        Html: {
          Data: html || "",
        },
      },
    },
  };

  await ses.send(new SendEmailCommand(params));
};

module.exports = sendEmail;

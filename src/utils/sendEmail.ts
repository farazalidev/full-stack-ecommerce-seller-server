import * as nodemailer from 'nodemailer';

export const sendEmail = async (
  to: string,
  message: string,
): Promise<nodemailer.SentMessageInfo> => {
  const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lonnie.jaskolski78@ethereal.email', // generated ethereal user
      pass: '9bG2qz9jFTx9hub839', // generated ethereal password
    },
  };
  const transport = nodemailer.createTransport(mailConfig);

  const sendedEmail = await transport.sendMail({
    from: 'Amazon',
    to,
    subject: 'Registration verification',
    text: `${message}`,
  });

  return sendedEmail;
};

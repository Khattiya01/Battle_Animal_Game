import Nodemailer from "nodemailer";
import { MailtrapClient, MailtrapTransport } from "mailtrap";
import { env } from "./envConfig";

export function sendMail(props: {
  title: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
  }[];
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  recipientName: string;
}) {
  const transport = Nodemailer.createTransport(
    MailtrapTransport({
      token: env.TOKEN_MAILTRAP,
    })
  );

  // transport
  //   .sendMail({
  //     text: props.title,
  //     to: {
  //       address: props.recipientEmail,
  //       name: props.recipientName,
  //     },
  //     from: {
  //       address: props.senderEmail,
  //       name: props.senderName,
  //     },
  //     subject: props.subject,
  //     html: props.html,
  //     //   `
  //     //   <!doctype html>
  //     //   <html>
  //     //     <head>
  //     //       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  //     //     </head>
  //     //     <body style="font-family: sans-serif;">
  //     //       <div style="display: block; margin: auto; max-width: 600px;" class="main">
  //     //         <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for sending test email with Mailtrap!</h1>
  //     //         <p>Inspect it using the tabs you see above and learn how this email can be improved.</p>
  //     //         <img alt="Inspect with Tabs" src="cid:welcome.png" style="width: 100%;">
  //     //         <p>Now send your email using our fake SMTP server and integration of your choice!</p>
  //     //         <p>Good luck! Hope it works.</p>
  //     //       </div>
  //     //       <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
  //     //       <style>
  //     //         .main { background-color: white; }
  //     //         a:hover { border-left-width: 1em; min-height: 2em; }
  //     //       </style>
  //     //     </body>
  //     //   </html>
  //     // `
  //     //   attachments: [
  //     //     {
  //     //       filename: "welcome.png",
  //     //       content: readFileSync("./welcome.png"),
  //     //     },
  //     //   ],
  //     attachments: props.attachments,
  //   })
  //   .then(console.log)
  //   .catch(console.error);
}

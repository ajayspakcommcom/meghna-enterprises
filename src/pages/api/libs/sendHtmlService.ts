
import nodemailer from 'nodemailer';
import path from 'path';

interface EmailData {
    recipient: string;
    subject: string;
    htmlContent: string;
}

const sendHtmlContent = async ({ recipient, subject, htmlContent }: EmailData): Promise<boolean> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'seedsfeedsindia@gmail.com',
            pass: 'jsmjhxlchodmzlar'
        },
    });

    const mailOptions = {
        from: 'seedsfeedsindia@gmail.com',
        to: recipient,
        subject: subject,
        html: `${htmlContent}`,        
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return true; // Email sent successfully
    } catch (error) {
        console.error('Error sending email:', error);
        return false; // Email sending failed
    }
};

export { sendHtmlContent };
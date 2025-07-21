const transporter = require("../config/emailConfig");
const Role = require("../model/Role");

const sendEmailCredentials = async (user, password) => {
  try {
    const roleDoc = await Role.findById(user.role);
    const roleName = roleDoc?.name || "User";

    const info = await transporter.sendMail({
      from: `"E-Commerce App" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Your Login Credentials - E-Commerce App",
      text: `Welcome to E-Commerce App\n\nLogin Credentials:\nName: ${user.name}\nRole: ${roleName}\nEmail: ${user.email}\nPassword: ${password}\n\nPlease login and change your password immediately.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Welcome to E-Commerce App, ${user.name}!</h2>
          <p style="font-size: 16px;">Your account has been created successfully with the following credentials:</p>
          <table style="width: 100%; margin: 20px 0; font-size: 15px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Role:</td>
              <td style="padding: 8px;">${roleName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">${user.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Password:</td>
              <td style="padding: 8px;">${password}</td>
            </tr>
          </table>
          <p style="font-size: 15px;">For security reasons, please login and change your password immediately.</p>
          <p style="font-size: 14px;">If you did not request this account, please contact support immediately.</p>
          <hr style="margin-top: 30px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">This email was sent to ${user.email} as part of your registration on E-Commerce App.</p>
        </div>
      `,
    });

    console.log("Verification email sent successfully: %s", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = sendEmailCredentials;

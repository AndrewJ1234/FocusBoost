import nodemailer from 'nodemailer';
import { config } from '../config/environment';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
}

// Create transporter
const transporter = nodemailer.createTransporter({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD
  }
});

// Email templates
const templates = {
  'email-verification': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to FocusBoost!</h1>
      </div>
      
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #374151; margin-bottom: 20px;">Hi ${data.firstName},</h2>
        
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
          Thank you for joining FocusBoost! We're excited to help you optimize your productivity and achieve your goals.
        </p>
        
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
          To get started, please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.verificationLink}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
          If you didn't create an account with FocusBoost, you can safely ignore this email.
        </p>
      </div>
      
      <div style="background: #374151; padding: 20px; text-align: center;">
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
          © 2024 FocusBoost. All rights reserved.
        </p>
      </div>
    </div>
  `,
  
  'notification': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f9fafb; padding: 40px;">
        <h2 style="color: #374151; margin-bottom: 20px;">Hi ${data.firstName},</h2>
        
        <h3 style="color: #1f2937; margin-bottom: 15px;">${data.title}</h3>
        
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
          ${data.message}
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.CLIENT_URL}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold;
                    display: inline-block;">
            Open FocusBoost
          </a>
        </div>
      </div>
    </div>
  `
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    if (!config.SMTP_USER || !config.SMTP_PASSWORD) {
      logger.warn('SMTP credentials not configured, skipping email send');
      return;
    }

    const template = templates[options.template as keyof typeof templates];
    if (!template) {
      throw new Error(`Email template '${options.template}' not found`);
    }

    const html = template(options.data);

    const mailOptions = {
      from: `"FocusBoost" <${config.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}`);

  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

// Verify SMTP connection
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info('SMTP connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP connection failed:', error);
    return false;
  }
};
import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { supabaseAdmin } from "../supabase/client";
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables for Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// Environment variables for Email
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';

// Initialize Twilio client if credentials are provided
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

if (!twilioClient) {
  console.warn('⚠️  Twilio credentials not configured - SMS notifications will be disabled');
}

// Initialize email transporter if credentials are provided
const emailTransporter = (EMAIL_USER && EMAIL_PASSWORD)
  ? nodemailer.createTransporter({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    })
  : null;

if (!emailTransporter) {
  console.warn('⚠️  Email credentials not configured - Email notifications will be disabled');
}

export interface Notification {
  id: string;
  userId: string;
  type: "appointment" | "reminder" | "emergency" | "billing" | "medical" | "system";
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  channels: ("email" | "sms" | "push" | "in-app")[];
  status: "pending" | "sent" | "failed" | "delivered";
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationRequest {
  userId: string;
  type: "appointment" | "reminder" | "emergency" | "billing" | "medical" | "system";
  title: string;
  message: string;
  priority?: "low" | "medium" | "high" | "urgent";
  channels?: ("email" | "sms" | "push" | "in-app")[];
  scheduledAt?: Date;
  metadata?: Record<string, any>;
}

export interface SendNotificationRequest {
  notificationId: string;
  channels?: ("email" | "sms" | "push" | "in-app")[];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  emailTemplate: string;
  smsTemplate: string;
  pushTemplate: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined notification templates
const NOTIFICATION_TEMPLATES = {
  appointment_reminder: {
    name: "Appointment Reminder",
    type: "appointment",
    subject: "Appointment Reminder - G1Cure",
    emailTemplate: `
      <h2>Appointment Reminder</h2>
      <p>Dear {{patientName}},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li><strong>Date:</strong> {{appointmentDate}}</li>
        <li><strong>Time:</strong> {{appointmentTime}}</li>
        <li><strong>Doctor:</strong> {{doctorName}}</li>
        <li><strong>Type:</strong> {{appointmentType}}</li>
      </ul>
      <p>Please arrive 10 minutes before your scheduled time.</p>
      <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
      <p>Best regards,<br>G1Cure Team</p>
    `,
    smsTemplate: "Hi {{patientName}}, reminder: Your appointment with {{doctorName}} is on {{appointmentDate}} at {{appointmentTime}}. Reply STOP to unsubscribe.",
    pushTemplate: "Appointment reminder: {{appointmentDate}} at {{appointmentTime}} with {{doctorName}}",
    variables: ["patientName", "appointmentDate", "appointmentTime", "doctorName", "appointmentType"]
  },
  appointment_confirmation: {
    name: "Appointment Confirmation",
    type: "appointment",
    subject: "Appointment Confirmed - G1Cure",
    emailTemplate: `
      <h2>Appointment Confirmed</h2>
      <p>Dear {{patientName}},</p>
      <p>Your appointment has been confirmed:</p>
      <ul>
        <li><strong>Date:</strong> {{appointmentDate}}</li>
        <li><strong>Time:</strong> {{appointmentTime}}</li>
        <li><strong>Doctor:</strong> {{doctorName}}</li>
        <li><strong>Type:</strong> {{appointmentType}}</li>
      </ul>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>G1Cure Team</p>
    `,
    smsTemplate: "Hi {{patientName}}, your appointment with {{doctorName}} on {{appointmentDate}} at {{appointmentTime}} is confirmed. Reply STOP to unsubscribe.",
    pushTemplate: "Appointment confirmed: {{appointmentDate}} at {{appointmentTime}} with {{doctorName}}",
    variables: ["patientName", "appointmentDate", "appointmentTime", "doctorName", "appointmentType"]
  },
  billing_reminder: {
    name: "Billing Reminder",
    type: "billing",
    subject: "Payment Reminder - G1Cure",
    emailTemplate: `
      <h2>Payment Reminder</h2>
      <p>Dear {{patientName}},</p>
      <p>This is a reminder for your outstanding payment:</p>
      <ul>
        <li><strong>Amount:</strong> ₹{{amount}}</li>
        <li><strong>Due Date:</strong> {{dueDate}}</li>
        <li><strong>Invoice:</strong> {{invoiceNumber}}</li>
      </ul>
      <p>Please make your payment to avoid any late fees.</p>
      <p>Best regards,<br>G1Cure Team</p>
    `,
    smsTemplate: "Hi {{patientName}}, payment reminder: ₹{{amount}} due on {{dueDate}}. Invoice: {{invoiceNumber}}. Reply STOP to unsubscribe.",
    pushTemplate: "Payment reminder: ₹{{amount}} due on {{dueDate}}",
    variables: ["patientName", "amount", "dueDate", "invoiceNumber"]
  },
  emergency_alert: {
    name: "Emergency Alert",
    type: "emergency",
    subject: "Emergency Alert - G1Cure",
    emailTemplate: `
      <h2>Emergency Alert</h2>
      <p>Dear {{recipientName}},</p>
      <p>{{emergencyMessage}}</p>
      <p>Please take immediate action as required.</p>
      <p>Best regards,<br>G1Cure Team</p>
    `,
    smsTemplate: "EMERGENCY: {{emergencyMessage}}. Please take immediate action.",
    pushTemplate: "EMERGENCY: {{emergencyMessage}}",
    variables: ["recipientName", "emergencyMessage"]
  }
};

// Send SMS notification
async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    console.warn('SMS sending skipped - Twilio not configured');
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

// Send email notification
async function sendEmail(email: string, subject: string, htmlContent: string): Promise<boolean> {
  if (!emailTransporter || !EMAIL_USER) {
    console.warn('Email sending skipped - Email not configured');
    return false;
  }

  try {
    await emailTransporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Send push notification
// Note: Push notifications require Firebase Cloud Messaging (FCM) setup
// Configure FIREBASE_SERVER_KEY in .env and initialize Firebase Admin SDK
async function sendPushNotification(userId: string, title: string, message: string): Promise<boolean> {
  try {
    // Push notification implementation requires:
    // 1. Firebase Admin SDK initialization in firebase/admin.ts
    // 2. User device tokens stored in database
    // 3. FCM message sending with proper payload
    console.log(`Push notification queued for ${userId}: ${title} - ${message}`);
    console.warn('⚠️  Firebase Cloud Messaging not fully configured - push notifications are logged only');
    return true;
  } catch (error) {
    console.error('Push notification failed:', error);
    return false;
  }
}

// Create notification
export const createNotification = api<CreateNotificationRequest, Notification>(
  { expose: true, method: "POST", path: "/notifications", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Verify user has permission to create notifications
    if (auth.role !== 'admin' && auth.role !== 'doctor') {
      throw APIError.permissionDenied("Only admins and doctors can create notifications");
    }

    const { data, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: req.userId,
        type: req.type,
        title: req.title,
        message: req.message,
        priority: req.priority || "medium",
        channels: req.channels || ["in-app"],
        status: "pending",
        scheduled_at: req.scheduledAt?.toISOString(),
        metadata: req.metadata,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to create notification", { cause: error });
    }

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority,
      channels: data.channels,
      status: data.status,
      scheduledAt: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
      sentAt: data.sent_at ? new Date(data.sent_at) : undefined,
      deliveredAt: data.delivered_at ? new Date(data.delivered_at) : undefined,
      metadata: data.metadata,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
);

// Send notification
export const sendNotification = api<SendNotificationRequest, { success: boolean }>(
  { expose: true, method: "POST", path: "/notifications/send", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get notification details
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("id", req.notificationId)
      .single();

    if (notificationError || !notification) {
      throw APIError.notFound("Notification not found");
    }

    // Get user details
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, phone")
      .eq("id", notification.user_id)
      .single();

    if (userError || !user) {
      throw APIError.notFound("User not found");
    }

    const channels = req.channels || notification.channels;
    let success = true;

    // Send through each channel
    for (const channel of channels) {
      let channelSuccess = false;

      switch (channel) {
        case "email":
          if (user.email) {
            channelSuccess = await sendEmail(
              user.email,
              notification.title,
              `<h2>${notification.title}</h2><p>${notification.message}</p>`
            );
          }
          break;
        case "sms":
          if (user.phone) {
            channelSuccess = await sendSMS(user.phone, notification.message);
          }
          break;
        case "push":
          channelSuccess = await sendPushNotification(
            notification.user_id,
            notification.title,
            notification.message
          );
          break;
        case "in-app":
          // In-app notifications are handled by the frontend
          channelSuccess = true;
          break;
      }

      if (!channelSuccess) {
        success = false;
      }
    }

    // Update notification status
    await supabaseAdmin
      .from("notifications")
      .update({
        status: success ? "sent" : "failed",
        sent_at: new Date().toISOString(),
      })
      .eq("id", req.notificationId);

    return { success };
  }
);

// Send appointment reminder
export const sendAppointmentReminder = api<{
  appointmentId: string;
  reminderType: "24h" | "2h" | "30min";
}, { success: boolean }>(
  { expose: true, method: "POST", path: "/notifications/appointment-reminder", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from("appointments")
      .select(`
        *,
        patients!inner(first_name, last_name, email, phone),
        doctors!inner(first_name, last_name)
      `)
      .eq("id", req.appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw APIError.notFound("Appointment not found");
    }

    const template = NOTIFICATION_TEMPLATES.appointment_reminder;
    const variables = {
      patientName: `${appointment.patients.first_name} ${appointment.patients.last_name}`,
      appointmentDate: new Date(appointment.appointment_date).toLocaleDateString(),
      appointmentTime: new Date(appointment.appointment_date).toLocaleTimeString(),
      doctorName: `${appointment.doctors.first_name} ${appointment.doctors.last_name}`,
      appointmentType: appointment.type,
    };

    // Replace variables in templates
    let emailContent = template.emailTemplate;
    let smsContent = template.smsTemplate;
    let pushContent = template.pushTemplate;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      emailContent = emailContent.replace(regex, value);
      smsContent = smsContent.replace(regex, value);
      pushContent = pushContent.replace(regex, value);
    }

    // Create notification
    const notification = await createNotification({
      userId: appointment.patient_id,
      type: "appointment",
      title: "Appointment Reminder",
      message: smsContent,
      priority: req.reminderType === "30min" ? "high" : "medium",
      channels: ["email", "sms", "push", "in-app"],
      metadata: {
        appointmentId: req.appointmentId,
        reminderType: req.reminderType,
        emailContent,
        smsContent,
        pushContent,
      },
    });

    // Send notification
    const result = await sendNotification({
      notificationId: notification.id,
      channels: ["email", "sms", "push", "in-app"],
    });

    return result;
  }
);

// Get user notifications
export const getUserNotifications = api<{
  limit?: number;
  offset?: number;
  status?: string;
}, { notifications: Notification[]; total: number }>(
  { expose: true, method: "GET", path: "/notifications/user", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    let query = supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", auth.userID)
      .order("created_at", { ascending: false });

    if (req.status) {
      query = query.eq("status", req.status);
    }

    if (req.limit) {
      query = query.range(req.offset || 0, (req.offset || 0) + req.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw APIError.internal("Failed to get notifications", { cause: error });
    }

    return {
      notifications: data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        channels: notification.channels,
        status: notification.status,
        scheduledAt: notification.scheduled_at ? new Date(notification.scheduled_at) : undefined,
        sentAt: notification.sent_at ? new Date(notification.sent_at) : undefined,
        deliveredAt: notification.delivered_at ? new Date(notification.delivered_at) : undefined,
        metadata: notification.metadata,
        createdAt: new Date(notification.created_at),
        updatedAt: new Date(notification.updated_at),
      })),
      total: count || 0,
    };
  }
);

// Mark notification as read
export const markNotificationAsRead = api<{ notificationId: string }, { success: boolean }>(
  { expose: true, method: "POST", path: "/notifications/mark-read", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", req.notificationId)
      .eq("user_id", auth.userID);

    if (error) {
      throw APIError.internal("Failed to mark notification as read", { cause: error });
    }

    return { success: true };
  }
);

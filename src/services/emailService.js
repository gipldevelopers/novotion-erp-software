// src/services/emailService.js
import nodemailer from 'nodemailer'

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }

  // Send email
  async sendEmail(emailData) {
    const { to, subject, text, html, cc, bcc, attachments } = emailData
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text,
      html,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
      attachments: attachments || []
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      return {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      }
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  // Send calendar invite
  async sendCalendarInvite(inviteData) {
    const { to, subject, description, start, end, location, organizer } = inviteData
    
    const ical = require('ical-generator')
    const calendar = ical({
      name: 'CRM Activity',
      timezone: 'UTC'
    })

    calendar.createEvent({
      start: new Date(start),
      end: new Date(end),
      summary: subject,
      description: description,
      location: location,
      organizer: organizer,
      attendees: to.map(email => ({ email }))
    })

    const emailData = {
      to,
      subject,
      text: description,
      html: `<p>${description}</p><p>Calendar invite attached.</p>`,
      icalEvent: {
        filename: 'invite.ics',
        content: calendar.toString()
      }
    }

    return this.sendEmail(emailData)
  }

  // Send meeting reminder
  async sendReminder(reminderData) {
    const { to, subject, activityTitle, dateTime, location, joinLink } = reminderData
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reminder: ${activityTitle}</h2>
        <p><strong>Time:</strong> ${new Date(dateTime).toLocaleString()}</p>
        ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
        ${joinLink ? `<p><strong>Join Link:</strong> <a href="${joinLink}">${joinLink}</a></p>` : ''}
        <p>Please be prepared for the meeting.</p>
      </div>
    `

    const emailData = {
      to,
      subject: `Reminder: ${subject}`,
      html
    }

    return this.sendEmail(emailData)
  }
}

// Gmail API integration
export class GmailService {
  constructor(auth) {
    this.auth = auth
  }

  async sendEmail(emailData) {
    const { gmail } = await import('googleapis').then(mod => mod.google)
    const gmailClient = gmail({ version: 'v1', auth: this.auth })
    
    const message = [
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      '',
      emailData.html
    ].join('\n')

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    try {
      const response = await gmailClient.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error sending email via Gmail API:', error)
      throw error
    }
  }
}

// Singleton instance
export const emailService = new EmailService()
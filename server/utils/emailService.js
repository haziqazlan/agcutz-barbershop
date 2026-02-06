import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send booking notification to admin
export const sendBookingNotification = async (appointment) => {
  // Skip if email not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email not configured, skipping notification');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New Booking - ${appointment.customerName} on ${new Date(appointment.date).toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C41E3A;">🎉 New Appointment Booking</h2>
        
        <div style="background-color: #f5f1e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Customer Details</h3>
          <p><strong>Name:</strong> ${appointment.customerName}</p>
          <p><strong>Email:</strong> ${appointment.customerEmail}</p>
          <p><strong>Phone:</strong> ${appointment.customerPhone}</p>
        </div>
        
        <div style="background-color: #f5f1e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details</h3>
          <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${appointment.timeSlot}</p>
          <p><strong>Type:</strong> ${appointment.appointmentType === 'inPerson' ? '🏪 In-Person' : '🚗 Outcall Service'}</p>
          ${appointment.appointmentType === 'outcall' ? `
            <p><strong>Address:</strong><br>
            ${appointment.address.street}<br>
            ${appointment.address.city}, ${appointment.address.zip}</p>
          ` : ''}
          <p><strong>Price:</strong> $${appointment.price}</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Login to your admin dashboard to manage this appointment:<br>
          <a href="https://agcutz-barbershop.vercel.app/admin/login" style="color: #C41E3A; text-decoration: none; font-weight: bold;">📱 View Dashboard</a>
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Booking notification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Don't throw - we don't want email failure to block bookings
  }
};
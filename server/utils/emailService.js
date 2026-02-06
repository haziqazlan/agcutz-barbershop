import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send booking notification to admin
export const sendBookingNotification = async (appointment) => {
  // Skip if Resend not configured
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email not configured, skipping notification');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'AG+ CUTZ Barbershop <onboarding@resend.dev>',
      to: [process.env.ADMIN_NOTIFICATION_EMAIL],
      subject: `🎉 New Booking - ${appointment.customerName} on ${new Date(appointment.date).toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f1e8; padding: 30px; border-radius: 10px;">
          <div style="background-color: #C41E3A; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💈 New Appointment</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #C41E3A; margin-top: 0;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Name:</td>
                <td style="padding: 10px 0; color: #666;">${appointment.customerName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Email:</td>
                <td style="padding: 10px 0; color: #666;">${appointment.customerEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Phone:</td>
                <td style="padding: 10px 0; color: #666;">${appointment.customerPhone}</td>
              </tr>
            </table>

            <h2 style="color: #C41E3A; margin-top: 30px;">Appointment Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Date:</td>
                <td style="padding: 10px 0; color: #666;">${new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Time:</td>
                <td style="padding: 10px 0; color: #666;">${appointment.timeSlot}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Type:</td>
                <td style="padding: 10px 0; color: #666;">${appointment.appointmentType === 'inPerson' ? '🏪 In-Person' : '🚗 Outcall Service'}</td>
              </tr>
              ${appointment.appointmentType === 'outcall' ? `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #333; vertical-align: top;">Address:</td>
                <td style="padding: 10px 0; color: #666;">
                  ${appointment.address.street}<br>
                  ${appointment.address.city}, ${appointment.address.zip}
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #333;">Price:</td>
                <td style="padding: 10px 0; color: #C41E3A; font-size: 20px; font-weight: bold;">$${appointment.price}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://agcutz-barbershop.vercel.app/admin/login" 
                 style="background-color: #C41E3A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                📱 View Dashboard
              </a>
            </div>

            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              AG+ CUTZ Barbershops | Professional Haircuts
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return;
    }

    console.log('✅ Booking notification email sent successfully:', data.id);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};
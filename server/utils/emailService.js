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
      from: 'AG+ CUTZ Barbershop <bookings@agcutz.site>',
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

// Send confirmation email to customer
export const sendCustomerConfirmation = async (appointment) => {
  // Skip if Resend not configured
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email not configured, skipping customer confirmation');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'AG+ CUTZ Barbershop <bookings@agcutz.site>',
      to: [appointment.customerEmail],
      subject: `✅ Appointment Confirmed - ${new Date(appointment.date).toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f1e8; padding: 30px; border-radius: 10px;">
          <div style="background-color: #003366; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💈 Appointment Confirmed!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; color: #333; margin-top: 0;">Hi ${appointment.customerName},</p>
            
            <p style="font-size: 16px; color: #666; line-height: 1.6;">
              Thank you for booking with AG+ CUTZ Barbershops! Your appointment has been confirmed.
            </p>

            <div style="background-color: #f5f1e8; padding: 20px; border-left: 4px solid #C41E3A; margin: 30px 0;">
              <h2 style="color: #C41E3A; margin-top: 0; font-size: 20px;">📅 Your Appointment Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">Date:</td>
                  <td style="padding: 12px 0; color: #666;">${new Date(appointment.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">Time:</td>
                  <td style="padding: 12px 0; color: #666;">${appointment.timeSlot}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">Service:</td>
                  <td style="padding: 12px 0; color: #666;">Standard Haircut</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">Type:</td>
                  <td style="padding: 12px 0; color: #666;">${appointment.appointmentType === 'inPerson' ? '🏪 In-Person' : '🚗 Outcall Service'}</td>
                </tr>
                ${appointment.appointmentType === 'outcall' ? `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 12px 0; font-weight: bold; color: #333; vertical-align: top;">Location:</td>
                  <td style="padding: 12px 0; color: #666;">
                    ${appointment.address.street}<br>
                    ${appointment.address.city}, ${appointment.address.zip}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">Total Price:</td>
                  <td style="padding: 12px 0; color: #C41E3A; font-size: 24px; font-weight: bold;">$${appointment.price}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⏰ Please arrive 5 minutes early</strong><br>
                ${appointment.appointmentType === 'outcall' ? 'Please ensure someone is available at the location.' : 'We look forward to seeing you at our shop!'}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Need to make changes?</p>
              <p style="color: #666; font-size: 14px;">
                Contact us: <strong style="color: #C41E3A;">2232573488</strong><br>
                Email: <strong style="color: #C41E3A;">haziqazlanshah@gmail.com</strong>
              </p>
            </div>

            <div style="border-top: 2px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 5px 0;">
                AG+ CUTZ Barbershops<br>
                Professional Haircuts | Traditional Craftsmanship
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error sending customer confirmation:', error);
      return;
    }

    console.log('✅ Customer confirmation email sent successfully:', data.id);
  } catch (error) {
    console.error('❌ Error sending customer confirmation:', error.message);
  }
};
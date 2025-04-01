import os
import datetime
import sendgrid
from sendgrid.helpers.mail import Mail
from twilio.rest import Client

# CONFIGURE THIS
SENDGRID_API_KEY = "your_sendgrid_api_key"
TWILIO_ACCOUNT_SID = "USaf590986c73506fa038b91495fe0c7aa"
TWILIO_AUTH_TOKEN = "your_twilio_auth_token"
TWILIO_PHONE_NUMBER = "2402813143"
YOUR_PHONE_NUMBER = "your_personal_phone_number"
YOUR_EMAIL = "your_email@example.com"

# Example: A deadline date
deadline_date = datetime.date(2025, 3, 15)  # Change to any date

# Check if today is the deadline
if datetime.date.today() == deadline_date:
    # Send Email
    sg = sendgrid.SendGridAPIClient(SENDGRID_API_KEY)
    email_message = Mail(
        from_email="your_email@example.com",
        to_emails=YOUR_EMAIL,
        subject="Deadline Alert!",
        plain_text_content=f"Reminder: Your deadline is today ({deadline_date})."
    )
    sg.send(email_message)
    print("Email sent!")

    # Send SMS
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    sms_message = client.messages.create(
        body=f"Reminder: Your deadline is today ({deadline_date}).",
        from_=TWILIO_PHONE_NUMBER,
        to=YOUR_PHONE_NUMBER
    )
    print("SMS sent!")

else:
    print("No deadline today. No notifications sent.")

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Sends an SMS message using Twilio's Messages API and logs the attempt in Firestore.
 *
 * @param phoneNumber The recipient's phone number.
 * @param message The SMS text content.
 * @returns A promise resolving to the API response success status.
 */
export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
  const twilioNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioNumber) {
    console.error(
      'Twilio environment variables are missing. Please add VITE_TWILIO_ACCOUNT_SID, VITE_TWILIO_AUTH_TOKEN, and VITE_TWILIO_PHONE_NUMBER to your .env file.'
    );

    // Log failure to Firestore
    try {
      const smsLogsCol = collection(db, 'SmsLogs');
      await addDoc(smsLogsCol, {
        phoneNumber,
        message,
        timestamp: serverTimestamp(),
        status: 'failed',
        error: 'Missing Twilio environment variables'
      });
    } catch (fsErr) {
      console.error('Failed to write failure log to Firestore:', fsErr);
    }
    return false;
  }

  const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  // Basic Auth header
  const authHeader = 'Basic ' + btoa(`${accountSid}:${authToken}`);

  // Form urlencoded body
  const bodyParams = new URLSearchParams();
  bodyParams.append('To', phoneNumber);
  bodyParams.append('From', twilioNumber);
  bodyParams.append('Body', message);

  let success = false;
  try {
    const response = await fetch(twilioApiUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    });

    if (response.ok) {
      success = true;
      console.log(`SMS successfully sent to ${phoneNumber}`);
    } else {
      const errData = await response.json();
      console.error('Twilio API returned error response:', errData);
    }
  } catch (error) {
    console.error('Network error calling Twilio API:', error);
  }

  // Save the record in Firestore collection "SmsLogs"
  try {
    const smsLogsCol = collection(db, 'SmsLogs');
    await addDoc(smsLogsCol, {
      phoneNumber,
      message,
      timestamp: serverTimestamp(),
      status: success ? 'sent' : 'failed'
    });
  } catch (fsErr) {
    console.error('Failed to log SMS to Firestore:', fsErr);
  }

  return success;
}

/**
 * Triggers an appointment SMS notification.
 */
export async function notifyAppointment(phoneNumber: string, date: string, time: string): Promise<boolean> {
  const message = `Your appointment is on ${date} at ${time}.`;
  return sendSMS(phoneNumber, message);
}

/**
 * Triggers a follow-up checkup SMS notification.
 */
export async function notifyFollowUp(phoneNumber: string): Promise<boolean> {
  const message = `Reminder: your follow-up checkup is due this week.`;
  return sendSMS(phoneNumber, message);
}

// Console testing helpers
if (typeof window !== 'undefined') {
  (window as any).sendSMS = sendSMS;
  (window as any).notifyAppointment = notifyAppointment;
  (window as any).notifyFollowUp = notifyFollowUp;
  (window as any).runSmsTest = async (testNumber?: string) => {
    const targetNumber = testNumber || '+15005550006'; // Twilio standard magic test number
    console.log(`Running Twilio SMS notifications test for: ${targetNumber}`);

    try {
      console.log('Testing general SMS sending...');
      await sendSMS(targetNumber, 'Test message from SwasthyaSetu Twilio Integration.');

      console.log('Testing notifyAppointment trigger...');
      await notifyAppointment(targetNumber, '2026-08-30', '10:30 AM');

      console.log('Testing notifyFollowUp trigger...');
      await notifyFollowUp(targetNumber);

      console.log(
        '%cSMS notifications test process triggered! Check SmsLogs Firestore collection and console details.',
        'color: #10b981; font-weight: bold;'
      );
    } catch (error) {
      console.error('SMS test execution encountered an error:', error);
    }
  };

  console.log('sms service loaded! Call runSmsTest("+15005550006") in this console to verify.');
}

import SmsAndroid from 'react-native-get-sms-android';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: 'SMS Permission',
      message: 'This app needs access to your SMS to detect MPesa transactions.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function fetchMpesaMessagesThisMonth(): Promise<string[]> {
  const granted = await requestSmsPermission();
  if (!granted) {
    console.warn('❌ SMS permission not granted.');
    return [];
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const minDate = startOfMonth.getTime();

  return new Promise((resolve, reject) => {
    SmsAndroid.list(
      JSON.stringify({
        box: 'inbox',
        address: 'MPESA', // Sender filter
        minDate,
        maxCount: 500,
      }),
      (fail: any) => {
        console.error('❌ SMS scan failed:', fail);
        reject(fail);
      },
      (count: number, smsList: string) => {
        try {
          console.log(`✅ SMS scan success. Count: ${count}`);

          if (!smsList || typeof smsList !== 'string') {
            console.warn('⚠️ smsList is empty or not a string');
            resolve([]);
            return;
          }

          const parsed = JSON.parse(smsList);

          if (!Array.isArray(parsed)) {
            console.warn('⚠️ Parsed SMS list is not an array:', parsed);
            resolve([]);
            return;
          }

          // Filter only valid MPESA messages with a body
          const filtered = parsed
            .filter(
              (m) =>
                m &&
                typeof m.body === 'string' &&
                m.body.trim().length > 0 &&
                typeof m.address === 'string' &&
                m.address.toUpperCase() === 'MPESA'
            )
            .map((m) => m.body);

          console.log(`✅ Extracted ${filtered.length} clean M-PESA messages.`);
          resolve(filtered);
        } catch (error) {
          console.error('❌ Failed to parse SMS list:', error);
          reject(error);
        }
      }
    );
  });
}

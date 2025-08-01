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
  if (!granted) return [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const minDate = startOfMonth.getTime();

  return new Promise((resolve, reject) => {
    SmsAndroid.list(
      JSON.stringify({
        box: 'inbox',
        minDate,
        bodyRegex: '(?i)M-PESA',
        maxCount: 500,
      }),
      (fail: any) => {
        console.error('Failed to read SMS:', fail);
        reject(fail);
      },
      (count: number, smsList: string) => {
        try {
          const messages = JSON.parse(smsList) as { body: string }[];
          const filtered = messages.map((m) => m.body);
          resolve(filtered);
        } catch (e) {
          reject('Failed to parse SMS list');
        }
      }
    );
  });
}

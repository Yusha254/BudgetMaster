declare module 'react-native-get-sms-android' {
  interface SmsQueryConfig {
    box: 'inbox' | 'sent' | 'draft';
    minDate?: number;
    maxDate?: number;
    bodyRegex?: string;
    address?: string;
    maxCount?: number;
  }

  interface SmsMessage {
    _id: number;
    address: string;
    body: string;
    date: number;
    read: number;
    seen: number;
    thread_id: number;
  }

  function list(
    filter: string,
    onFailure: (error: any) => void,
    onSuccess: (count: number, smsList: string) => void
  ): void;

  const SmsAndroid: {
    list: typeof list;
  };

  export default SmsAndroid;
}

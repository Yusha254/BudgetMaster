import { useEffect, useState } from 'react';
import { fetchMpesaMessagesThisMonth } from '../utils/SmsUtils';
import { parseMpesaMessage, ParsedTransaction, ParsedFuliza } from '../utils/MpesaParser';
import { insertTransactionFromParsed } from '../utils/DatabaseUtils';

export function useSMSScanner(autoScan = true) {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoScan) return;

    scanMessages();
  }, [autoScan]);

async function scanMessages() {
  try {
    const messages = await fetchMpesaMessagesThisMonth();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid message list received.');
    }

    const parsedList = await Promise.all(messages.map(parseMpesaMessage));
    const validParsed = parsedList.filter((p): p is ParsedTransaction | ParsedFuliza => p !== null);

    for (const parsed of validParsed) {
      await insertTransactionFromParsed(parsed);
    }

    setScanned(true);
  } catch (err) {
    console.error('❌ SMS scan error:', err);
    setError((err as Error).message);
  }
}


  return { scanned, error, scanMessages };
}

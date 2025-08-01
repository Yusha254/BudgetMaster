// utils/mpesaParser.ts
import { categorizeTransaction } from './CategorizationUtils';
import { formatName } from './StringUtils';
import { convertToISO } from './DateUtils';

export type ParsedTransaction = {
  type: 'transaction';
  code: string;
  amount: number;
  cost: number;
  date: string;
  time: string;
  isIncome: boolean | null;
  name: string;
  category: string;
};

export type ParsedFuliza = {
  type: 'fuliza';
  transactionCode: string;
  amount: number;
  interest: number;
  dueDate: string;
};

export type ParsedResult = ParsedTransaction | ParsedFuliza | null;

export async function parseMpesaMessage(message: string): Promise<ParsedResult> {
  if (/Fuliza M-PESA amount/i.test(message)) {
    return parseFulizaMessage(message);
  }
  return await parseTransactionMessage(message);
}

async function parseTransactionMessage(message: string): Promise<ParsedTransaction | null> {
  const transactionCodeRegex = /^([A-Z0-9]+)\s+Confirmed\./i;
  const amountRegex = /Ksh([\d,]+\.\d{2})/i;
  const costRegex = /Transaction cost,\s*Ksh([\d,]+\.\d{2})/i;
  const dateTimeRegex = /on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+([\d:]+(?:\s*[APMapm]{2})?)/;
  const incomeNameRegex = /from\s+([A-Z\s]+?)(?=\s*\d{10}| on)/i;
  const expenseNameRegex = /(?:sent to|paid to)\s+([A-Z\s]+?)(?=\s*\d{10}|\.| on)/i;

  const transactionCode = message.match(transactionCodeRegex)?.[1] || 'N/A';
  const amount = parseFloat((message.match(amountRegex)?.[1] || '0').replace(/,/g, ''));
  const transactionCost = parseFloat((message.match(costRegex)?.[1] || '0').replace(/,/g, ''));
  const dateTimeMatch = message.match(dateTimeRegex);
  const rawDate = dateTimeMatch?.[1] || 'N/A';
  const date = convertToISO(rawDate) || 'N/A';
  const time = dateTimeMatch?.[2] || 'N/A';

  let isIncome = null;
  if (/you have received/i.test(message)) {
    isIncome = true;
  } else if (/sent to|paid to/i.test(message)) {
    isIncome = false;
  }

  const rawName =
    isIncome === true
      ? message.match(incomeNameRegex)?.[1]?.trim() || 'N/A'
      : isIncome === false
      ? message.match(expenseNameRegex)?.[1]?.trim() || 'N/A'
      : 'N/A';

  const name = formatName(rawName);
  const category = await categorizeTransaction(name);

  return {
    type: 'transaction',
    code: transactionCode,
    amount,
    cost: transactionCost,
    date,
    time,
    isIncome,
    name,
    category,
  };
}

function parseFulizaMessage(message: string): ParsedFuliza | null {
  const transactionCodeRegex = /^([A-Z0-9]+)\s+Confirmed\./i;
  const totalAmountRegex = /Fuliza M-PESA amount is Ksh([\d,]+\.\d{2})/i;
  const interestRegex = /Interest charged Ksh([\d,]+\.\d{2})/i;
  const dueDateRegex = /due on (\d{1,2}\/\d{1,2}\/\d{2,4})/;

  const transactionCode = message.match(transactionCodeRegex)?.[1] || 'N/A';
  const amount = parseFloat((message.match(totalAmountRegex)?.[1] || '0').replace(/,/g, ''));
  const interest = parseFloat((message.match(interestRegex)?.[1] || '0').replace(/,/g, ''));
  const rawDueDate = message.match(dueDateRegex)?.[1];
  const dueDate = convertToISO(rawDueDate || '') || 'N/A';

  return {
    type: 'fuliza',
    transactionCode: transactionCode,
    amount,
    interest,
    dueDate,
  };
}

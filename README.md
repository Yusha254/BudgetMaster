# BudgetMaster 📱

## Track your MPESA transactions effortlessly.

BudgetMaster is a React Native app (runs on Expo Dev Client) designed for smart financial tracking. It reads MPESA SMS messages—including overdraft (Fuliza) notices—automatically, parses them, and stores each transaction in a local SQLite database with real-time analytics.

## 🔍 Features

- 📥 Automatic SMS parsing of MPESA transactions and Fuliza debt messages.
- 🧮 Expense and Income detection, including transaction costs.
- 🐛 Duplicate prevention using unique MPESA transaction codes.
- 📊 Category breakdown and spending overview by time period.
- 💾 Offline-first storage using local SQLite database.
- 🌙 Light / dark optimized themes
- 🧠 Flexible for AI-powered categorization and analytics

## 🚀 Why Choose BudgetMaster?

- Built with React Native & TypeScript for performance and type safety.
- Clean, intuitive UI, inspired by beautiful design.
- Designed with automation in mind — human effort minimized.
- Secure: Local-first data storage; no sensitive info sent remotely.
- Built to help users make smarter financial decisions quickly.

## 🛠 Installation & Setup

### Prerequisites

- Android device/emulator (SMS access)
- Expo Dev Client (required for custom native module support)

### Install & Prepare

```
git clone https://github.com/Yusha254/BudgetMaster.git
cd BudgetMaster
npm install
npx expo prebuild
npm run android   # or expo run:android
```

### Permissions (Android)

Ensure the following permissions in android/app/src/main/AndroidManifest.xml:

```
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />

```

## 🔁 How It Works

1. On launch, the app calls useSMSScanner:

   - Requests SMS read permission
   - Reads MPESA messages from the inbox for the current month
   - Parses each message via MpesaParser

2. Parsed message types:

   - transaction → stored in transactions table
   - fuliza → stored in debts table

3. Duplicate checks use the MPESA transaction code before insertion.

4. Transaction data is accessible throughout the app via TransactionContext.

## 🔧 Customization & Usage

- Manual Scan: Trigger SMS scanning via a button calling scanMessages() from the useSMSScanner hook.
- Time Range Flexibility: Modify SMSUtils.fetchMpesaMessagesThisMonth() to scan other date ranges.
- Category Rules: Customize auto-categorization in CategorizationUtils.

## ✅ Future Enhancements

- 🔁 Support for recurring transaction detection.
- 🧩 Visual insights via charts in the Video component.
- ⏳ Background SMS scanning (eventually via native Android BroadcastReceiver).
- 🌐 Export/share data via .csv, PDF, or snapshot.

## 🧑‍💻 How to Contribute

All help is appreciated! You can:

- Submit pull requests for bugs or new features.
- Propose improved parsing logic for edge-case messages.
- Help with analytics or UI enhancements.

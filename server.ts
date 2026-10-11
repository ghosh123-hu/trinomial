import express from 'express';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory OTP store: email -> { code, expiresAt, name }
interface OtpEntry {
  code: string;
  expiresAt: number;
  name: string;
}
const otpStore = new Map<string, OtpEntry>();

// Send OTP Endpoint
app.post('/api/auth/send-otp', (req, res) => {
  const { email, name = 'Citizen' } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email address is required.' });
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(email.toLowerCase().trim(), {
    code: otpCode,
    expiresAt,
    name: name.trim() || 'Citizen',
  });

  console.log(`[OTP GENERATED] For: ${email} | Code: ${otpCode} | Name: ${name}`);

  // Execute Python script to dispatch SMTP email
  const scriptPath = path.join(__dirname, 'send_otp.py');
  execFile('python3', [scriptPath, email.trim(), otpCode, name.trim()], (error, stdout, stderr) => {
    if (error) {
      console.warn(`[SMTP WARNING] Failed sending email via SMTP: ${stderr || error.message}`);
      // Return success with demo code so the user can still proceed if email bounces or spam filters block
      return res.json({
        success: true,
        dispatched: false,
        message: 'Verification code generated. (Email gateway attempted; code available below for testing)',
        demoCode: otpCode,
        expiresInSeconds: 300,
      });
    }

    console.log(`[SMTP SUCCESS] Email successfully dispatched to ${email}`);
    return res.json({
      success: true,
      dispatched: true,
      message: `Verification passcode dispatched to ${email}.`,
      demoCode: otpCode, // Provided for instant convenience in dev
      expiresInSeconds: 300,
    });
  });
});

// Verify OTP Endpoint
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const entry = otpStore.get(cleanEmail);

  if (!entry) {
    return res.status(400).json({
      success: false,
      message: 'No verification request found for this email. Please request a new code.',
    });
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      message: 'Verification code has expired. Please request a new code.',
    });
  }

  if (entry.code !== otp.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect verification code. Please check your email and try again.',
    });
  }

  // Clear verified OTP
  otpStore.delete(cleanEmail);

  // Generate deterministic ledger ID based on email
  const hash = Math.abs(
    cleanEmail.split('').reduce((acc: number, char: string) => acc * 31 + char.charCodeAt(0), 0) % 9000
  ) + 1000;

  return res.json({
    success: true,
    message: 'Verification successful. Welcome to Kartavya Civic!',
    user: {
      name: entry.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: 'Verified Civic Contributor',
      ward: 'Ward 150 (Bellandur)',
      ledgerId: `#BLR-W150-${hash}`,
      trustRegistry: 'Digital Public Trust Registry Verified',
      standingScore: 88,
      standingLevel: 'Integrity Level IV',
    },
  });
});

// Mount Vite in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

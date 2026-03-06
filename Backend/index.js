// index.js
import dotenv from 'dotenv';
dotenv.config();

// Now use dynamic import for everything that needs env vars
import('./app.js').then(async ({ default: app }) => {
  const { default: connectDB } = await import('./config/db.js');
  const { default: passport } = await import('./config/googleStrategy.js'); // ← correct path

  const PORT = process.env.PORT || 5000;

  await connectDB();
  app.listen(PORT, () => {
    console.log(`QuickHire API running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
});
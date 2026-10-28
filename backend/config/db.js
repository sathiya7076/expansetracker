import mongoose from 'mongoose';

let connecting = null;

/** Safe to call on every request: reuses a live connection, reconnects if a frozen function lost it. */
export async function connectDB(uri) {
  if (mongoose.connection.readyState === 1) return;
  if (!connecting) {
    mongoose.set('strictQuery', true);
    connecting = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 })
      .then(() => console.log(`MongoDB connected: ${mongoose.connection.name}`))
      .catch((err) => {
        connecting = null; // allow a retry on the next request
        throw err;
      });
  }
  await connecting;
  connecting = null;
}

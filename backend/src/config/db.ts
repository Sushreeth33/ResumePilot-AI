import mongoose from 'mongoose';
import { env } from './env.js';

function maskMongoUri(uri: string) {
  try {
    const parsedUri = new URL(uri);

    if (parsedUri.password) {
      parsedUri.password = '<masked>';
    }

    if (parsedUri.username) {
      parsedUri.username = '<user>';
    }

    return parsedUri.toString();
  } catch {
    return '<invalid MongoDB URI>';
  }
}

function getMongoHost(uri: string) {
  try {
    return new URL(uri).host;
  } catch {
    return 'unknown-host';
  }
}

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected.');
    return;
  }

  const startedAt = Date.now();

  try {
    console.log(`Connecting to MongoDB: ${maskMongoUri(env.MONGODB_URI)}`);

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(
      `MongoDB connected to ${getMongoHost(env.MONGODB_URI)} in ${Date.now() - startedAt}ms.`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB connection error';

    console.error(`MongoDB connection failed for ${getMongoHost(env.MONGODB_URI)}: ${message}`);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});

mongoose.connection.on('error', (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

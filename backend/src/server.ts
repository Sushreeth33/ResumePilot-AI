import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`ResumePilot AI API listening on port ${env.PORT}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${env.PORT} is already in use. Stop the existing server or use another PORT.`,
        );
        process.exit(1);
      }

      console.error(`Server failed to start: ${error.message}`);
      process.exit(1);
    });
  } catch {
    process.exit(1);
  }
}

void bootstrap();

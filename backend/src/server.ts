import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`ResumePilot AI API listening on port ${env.PORT}`);
  });
}

void bootstrap();

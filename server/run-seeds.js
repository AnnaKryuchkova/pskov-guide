const { seedDatabase } = require('./db/seeders');
const db = require('./db');

(async () => {
  try {
    // Добавьте таймаут для ожидания готовности БД
    const maxAttempts = 5;
    let currentAttempt = 0;

    while (currentAttempt < maxAttempts) {
      try {
        await db.connect();
        break;
      } catch (err) {
        currentAttempt++;
        if (currentAttempt === maxAttempts) throw err;
        console.log(`DB connection failed (attempt ${currentAttempt}), retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    await seedDatabase();
    console.log('✅ Seeds applied successfully!');
  } catch (error) {
    console.error('❌ Failed to apply seeds:', error);
    process.exit(1);
  }
})();

import { db } from './src/db';
import { contactMessages, ppdbRegistrations } from './src/db/schema';
import { count } from 'drizzle-orm';

async function main() {
  try {
    console.log('Testing connection...');
    
    // Insert dummy contact message
    await db.insert(contactMessages).values({
      name: 'Test Sender',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message to verify dashboard connection',
    });
    console.log('✅ Dummy contact message inserted');

    // Run counts
    const [msgCount] = await db.select({ value: count() }).from(contactMessages);
    console.log(`✅ Total messages in DB: ${msgCount.value}`);

    const [ppdbCount] = await db.select({ value: count() }).from(ppdbRegistrations);
    console.log(`✅ Total PPDB registrations in DB: ${ppdbCount.value}`);
    

  } catch (error) {
    console.error('❌ Connection or query failed:');
    console.error(error);
  } finally {
    process.exit(0);
  }
}

main();

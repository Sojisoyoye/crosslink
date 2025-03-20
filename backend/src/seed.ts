import * as bcrypt from "bcrypt";
import { User } from "./users/users.entity";
import { Offer } from "./offers/offers.entity";
import { Transaction } from "./transactions/transactions.entity";
import { AppDataSource } from "./data-source";

async function seed() {
  // Initialize the DataSource
  await AppDataSource.initialize();

  // Seed Users
  const user1 = new User();
  user1.name = "John Doe";
  user1.email = "john@example.com";
  user1.password = await bcrypt.hash("password123", 10);
  user1.isVerified = true;

  const user2 = new User();
  user2.name = "Jane Doe";
  user2.email = "jane@example.com";
  user2.password = await bcrypt.hash("password123", 10);
  user2.isVerified = true;

  await AppDataSource.manager.save([user1, user2]);

  // Seed Offers
  const offer1 = new Offer();
  offer1.type = "buy";
  offer1.currency = "EUR";
  offer1.amount = 1000;
  offer1.rate = 1200;
  offer1.status = "pending";
  offer1.user = user1;

  const offer2 = new Offer();
  offer2.type = "sell";
  offer2.currency = "NGN";
  offer2.amount = 500000;
  offer2.rate = 0.0008;
  offer2.status = "pending";
  offer2.user = user2;

  await AppDataSource.manager.save([offer1, offer2]);

  // Seed Transactions
  const transaction1 = new Transaction();
  transaction1.senderId = user1.id;
  transaction1.receiverId = user2.id;
  transaction1.amount = 100;
  transaction1.currency = "EUR";
  transaction1.status = "completed";
  transaction1.user = user1;

  const transaction2 = new Transaction();
  transaction2.senderId = user2.id;
  transaction2.receiverId = user1.id;
  transaction2.amount = 120000;
  transaction2.currency = "NGN";
  transaction2.status = "pending";
  transaction2.user = user2;

  await AppDataSource.manager.save([transaction1, transaction2]);

  console.log("Database seeded successfully!");

  // Close the DataSource connection
  await AppDataSource.destroy();
}

seed().catch((error) => console.error("Error seeding database:", error));

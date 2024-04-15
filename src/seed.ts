import { DataSource } from "typeorm";
import { Client } from "pg";
import { User } from "./user/entities/user.entity";
import { Cat } from "./cats/entities/cat.entity";

const config = {
  database: "your_database_name",
  username: "your_database_username",  // This should be a superuser
  password: "your_password",
  host: "localhost",
  port: 5432,
  appUsername: "cat_app_user",
  appPassword: "cat_app_password",
};

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.host,
  port: config.port,
  username: config.appUsername,
  password: config.appPassword,
  database: config.database,
  entities: [User, Cat],
  synchronize: true,  // Note: Only set true in development
});

async function createDatabase() {
  const client = new Client({
    user: config.username,
    host: config.host,
    database: "postgres",
    password: config.password,
    port: config.port,
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${config.database}"`);
    console.log(`Database ${config.database} created!`);
    
    await client.query(`CREATE USER "${config.appUsername}" WITH ENCRYPTED PASSWORD '${config.appPassword}'`);
    console.log(`Database user ${config.appUsername} created!`);
    
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${config.database}" TO "${config.appUsername}"`);
    console.log(`Granted all privileges on ${config.database} to ${config.appUsername}`);
  } catch (e) {
    console.error("Error executing database operations", e);
  } finally {
    await client.end();
  }
}

async function seed() {
  try {
    await createDatabase();
    await AppDataSource.initialize();
    await seedUsers();
    await seedCats();
    console.log("Data seeded");
  } finally {
    await AppDataSource.destroy();
  }
}

async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);
  const users = userRepository.create([
    { fullName: "John", email: "john@example.com", password: "hashedpassword", role: "admin" },
    { fullName: "Nick", email: "nick@example.com", password: "hashedpassword", role: "member" },
  ]);
  await userRepository.save(users);
}

async function seedCats() {
  const catRepository = AppDataSource.getRepository(Cat);
  const cats = catRepository.create([
    { name: "Whiskers", age: 2, breed: "Siamese" },
    { name: "Felix", age: 3, breed: "Maine Coon" },
  ]);
  await catRepository.save(cats);
}

seed().catch(error => console.error("Seeding failed", error));

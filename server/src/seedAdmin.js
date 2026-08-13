import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://amutsaamutsa_db_user:yl7RApalrMt2uCkm@cluster0.msx2jpg.mongodb.net/northstar?appName=Cluster0";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
});

const User = mongoose.model('User', userSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const email = 'amutsaamutsa@gmail.com';
    const password = 'amutsaamutsa';
    
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`User ${email} already exists. Updating role to admin and resetting password...`);
      exists.password = await bcrypt.hash(password, 10);
      exists.role = 'admin';
      exists.name = 'Dennis Amutsa';
      await exists.save();
      console.log('User updated successfully!');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name: 'Dennis Amutsa',
        email: email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('User created successfully!');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

run();

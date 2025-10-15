const mongoose = require('mongoose');
const dotenv = require('dotenv');
const College = require('../models/College');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedColleges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing colleges
    await College.deleteMany();

    // Add default colleges
    const colleges = [
      { name: 'SCIENT INSTITUTE OF TECHNOLOGY' },
      { name: 'MALLA REDDY INSTITUTE OF TECHNOLOGY' },
      { name: 'Government Engineering College' },
      { name: 'VIT University' },
      { name: 'SRM Institute' }
    ];

    await College.insertMany(colleges);
    console.log('Colleges seeded successfully');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@consistency.ai' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'Admin',
        email: 'admin@consistency.ai',
        password: hashedPassword,
        phone: '1234567890',
        year: 'N/A',
        college: 'SCIENT INSTITUTE OF TECHNOLOGY',
        role: 'admin'
      });

      console.log('Admin user created: admin@consistency.ai / admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedColleges();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Well from './models/Well';
import Reading from './models/Reading';
import Alert from './models/Alert';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-compass';

const sampleWells = [
  {
    name: 'Community Well - Main Street',
    location: {
      type: 'Point',
      coordinates: [78.4867, 17.3850], // Hyderabad coordinates
    },
    address: 'Main Street, Hyderabad, Telangana',
    depth: 120,
    currentWaterLevel: 75,
    status: 'safe',
    owner: 'Municipal Corporation',
  },
  {
    name: 'Farmer Borewell - South Farm',
    location: {
      type: 'Point',
      coordinates: [78.4950, 17.3900],
    },
    address: 'South Farm Road, Hyderabad, Telangana',
    depth: 150,
    currentWaterLevel: 45,
    status: 'moderate',
    owner: 'Ravi Kumar',
  },
  {
    name: 'Village Well - North Zone',
    location: {
      type: 'Point',
      coordinates: [78.4800, 17.3800],
    },
    address: 'North Village, Hyderabad, Telangana',
    depth: 100,
    currentWaterLevel: 20,
    status: 'low',
    owner: 'Village Panchayat',
  },
  {
    name: 'School Borewell',
    location: {
      type: 'Point',
      coordinates: [78.4900, 17.3920],
    },
    address: 'Government School, Hyderabad, Telangana',
    depth: 130,
    currentWaterLevel: 15,
    status: 'critical',
    owner: 'Education Department',
  },
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Well.deleteMany({});
    await Reading.deleteMany({});
    await Alert.deleteMany({});

    // Insert wells
    console.log('📍 Creating wells...');
    const wells = await Well.insertMany(sampleWells);
    console.log(`✅ Created ${wells.length} wells`);

    // Insert readings for each well
    console.log('📊 Creating readings...');
    let readingCount = 0;
    for (const well of wells) {
      // Create 30 days of historical readings
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        await Reading.create({
          wellId: well._id,
          waterLevel: well.currentWaterLevel + Math.random() * 10 - 5,
          rainfall: Math.random() * 20,
          soilMoisture: 40 + Math.random() * 30,
          temperature: 25 + Math.random() * 10,
          timestamp: date,
        });
        readingCount++;
      }
    }
    console.log(`✅ Created ${readingCount} readings`);

    // Create alerts for low/critical wells
    console.log('⚠️  Creating alerts...');
    const criticalWells = wells.filter(
      (w: any) => w.status === 'critical' || w.status === 'low'
    );

    for (const well of criticalWells) {
      await Alert.create({
        wellId: well._id,
        type: well.status === 'critical' ? 'failure_warning' : 'low_water',
        severity: well.status === 'critical' ? 'critical' : 'high',
        message: `${well.name}: Water level is ${well.status}. Current level: ${well.currentWaterLevel} feet`,
        isRead: false,
      });
    }
    console.log(`✅ Created ${criticalWells.length} alerts`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Wells: ${wells.length}`);
    console.log(`   - Readings: ${readingCount}`);
    console.log(`   - Alerts: ${criticalWells.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

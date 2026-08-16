// scripts/seed.js
// Run with: npm run seed
// Loads the two real DNS Homes projects and creates an admin account
// from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local (or sensible defaults).
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Add it to .env.local first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const ProjectSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
  const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
  const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const projects = [
    {
      name: 'Mountain Bliss, Rajgir',
      slug: 'mountain-bliss-rajgir',
      locality: 'Saifabad, Rajgir, Nalanda',
      district: 'Nalanda',
      ratePerSqft: 950,
      plotSizes: [
        { sizeSqft: 600, code: 'H' },
        { sizeSqft: 900, code: 'G' },
        { sizeSqft: 1200, code: 'C' },
        { sizeSqft: 1800, code: 'B' },
        { sizeSqft: 2400, code: 'A' },
        { sizeSqft: 3000, code: 'D' },
      ],
      infraPoints: [
        'Next to the upcoming international cricket stadium',
        'Near hot springs, Jain temples & nature viewpoints',
        'Rajgir Sports Complex (opened 2024) nearby',
      ],
      paymentPlan: '20% booking, 40% agreement, balance in 60-month EMI — or 1% monthly rental plan if paid in full.',
      description:
        'A gated plotted township in Saifabad, Rajgir, right next to the international stadium — positioned around Rajgir\'s growing tourism and sports infrastructure.',
    },
    {
      name: 'Shuvida Enclave, Bihta',
      slug: 'shuvida-enclave-bihta',
      locality: 'Bihta, Patna',
      district: 'Patna',
      ratePerSqft: 1499,
      plotSizes: [
        { sizeSqft: 1000, code: '' },
        { sizeSqft: 1200, code: '' },
        { sizeSqft: 2400, code: '' },
        { sizeSqft: 3600, code: '' },
      ],
      infraPoints: [
        'IIT Patna & bus stand — 5 minutes',
        'Bihta railway station — 7 minutes',
        'International airport — 10 minutes',
        'Near ESIC Hospital, DAV & Central Public School',
      ],
      paymentPlan: '20% booking, 40% agreement, balance in 36-month EMI.',
      description:
        'A plotted enclave in Bihta built around fast-growing highway, rail, and airport access on the western edge of Patna.',
    },
  ];

  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    console.log(`Upserted project: ${p.name}`);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@townshipcapital.local').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-please';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: 'Township Admin', email: adminEmail, passwordHash, role: 'admin' });
    console.log(`Created admin account: ${adminEmail} (password: ${adminPassword}) — change this after first login.`);
  } else if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    await existingAdmin.save();
    console.log(`Promoted existing user ${adminEmail} to admin.`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

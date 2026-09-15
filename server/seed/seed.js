require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Lead = require('../models/Lead');

const sampleLeads = [
  { name: 'Ava Thompson', email: 'ava.thompson@brightpath.io', phone: '415-555-0110', company: 'BrightPath Inc', source: 'Website', status: 'New', notes: [{ text: 'Submitted contact form, interested in enterprise plan.' }] },
  { name: 'Liam Chen', email: 'liam.chen@northgate.com', phone: '212-555-0142', company: 'Northgate Logistics', source: 'LinkedIn', status: 'Contacted', notes: [{ text: 'Had intro call, sending proposal next week.' }] },
  { name: 'Sofia Martinez', email: 'sofia@venturaco.com', phone: '512-555-0198', company: 'Ventura & Co', source: 'Referral', status: 'Converted', notes: [{ text: 'Signed annual contract.' }] },
  { name: 'Noah Williams', email: 'noah.williams@pinecrest.org', phone: '312-555-0176', company: 'Pinecrest Foundation', source: 'Email', status: 'New', notes: [] },
  { name: 'Emma Johnson', email: 'emma.j@harbortech.com', phone: '206-555-0133', company: 'Harbor Tech', source: 'Advertisement', status: 'Contacted', notes: [{ text: 'Requested a demo for Thursday.' }] },
  { name: 'Oliver Brown', email: 'oliver.brown@summitworks.com', phone: '646-555-0155', company: 'Summit Works', source: 'Website', status: 'New', notes: [] },
  { name: 'Isabella Davis', email: 'isabella.davis@cloudnine.io', phone: '303-555-0122', company: 'CloudNine Systems', source: 'LinkedIn', status: 'Converted', notes: [{ text: 'Upsold to premium tier after trial.' }] },
  { name: 'Ethan Miller', email: 'ethan.miller@redwoodgrp.com', phone: '408-555-0187', company: 'Redwood Group', source: 'Referral', status: 'Contacted', notes: [{ text: 'Waiting on budget approval from their side.' }] },
  { name: 'Mia Wilson', email: 'mia.wilson@brightpath.io', phone: '415-555-0164', company: 'BrightPath Inc', source: 'Website', status: 'New', notes: [] },
  { name: 'James Taylor', email: 'james.taylor@lumenlabs.com', phone: '617-555-0143', company: 'Lumen Labs', source: 'Other', status: 'Contacted', notes: [{ text: 'Rescheduled call to next Monday.' }] },
  { name: 'Charlotte Anderson', email: 'charlotte.a@fernwoodco.com', phone: '773-555-0129', company: 'Fernwood & Co', source: 'Email', status: 'Converted', notes: [{ text: 'Closed deal, onboarding scheduled.' }] },
  { name: 'Benjamin Thomas', email: 'ben.thomas@westfieldpartners.com', phone: '469-555-0118', company: 'Westfield Partners', source: 'LinkedIn', status: 'New', notes: [] },
  { name: 'Amelia Jackson', email: 'amelia.jackson@northgate.com', phone: '212-555-0177', company: 'Northgate Logistics', source: 'Website', status: 'Contacted', notes: [{ text: 'Sent pricing sheet, awaiting response.' }] },
  { name: 'Lucas White', email: 'lucas.white@ironpeak.com', phone: '702-555-0161', company: 'Iron Peak Mining', source: 'Advertisement', status: 'New', notes: [] },
  { name: 'Harper Harris', email: 'harper.harris@venturaco.com', phone: '512-555-0104', company: 'Ventura & Co', source: 'Referral', status: 'Converted', notes: [{ text: 'Second contract signed for a new department.' }] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Admin: upsert so re-running the script is safe
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`Admin created: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('Admin already exists, skipping.');
    }

    // Leads: wipe and reseed so the dashboard has predictable demo numbers
    await Lead.deleteMany({});
    await Lead.insertMany(sampleLeads);
    console.log(`Seeded ${sampleLeads.length} leads.`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();

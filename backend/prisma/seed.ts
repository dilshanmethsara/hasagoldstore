import { PrismaClient, Role, AccountStatus, PromoKind } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hasastore.com' },
    update: {},
    create: {
      email: 'admin@hasastore.com',
      password: adminPassword,
      roles: [Role.ADMIN],
      status: AccountStatus.active,
      emailVerified: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      displayName: 'Admin User',
      username: 'admin',
      status: AccountStatus.active,
    },
  });

  console.log('✅ Admin user created');

  // Create test user
  const testPassword = await bcrypt.hash('test123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: testPassword,
      roles: [Role.USER],
      status: AccountStatus.active,
      emailVerified: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      displayName: 'Test User',
      username: 'testuser',
      status: AccountStatus.active,
    },
  });

  console.log('✅ Test user created');

  // Create sample games
  const game1 = await prisma.game.upsert({
    where: { slug: 'pubg-mobile' },
    update: {},
    create: {
      slug: 'pubg-mobile',
      name: 'PUBG Mobile',
      tagline: 'Battle Royale on Mobile',
      publisher: 'Tencent',
      imageUrl: 'https://example.com/pubg.jpg',
      cardImage: 'https://example.com/pubg-card.jpg',
      heroImage: 'https://example.com/pubg-hero.jpg',
      isFeatured: true,
      sortOrder: 1,
      isLive: true,
    },
  });

  const game2 = await prisma.game.upsert({
    where: { slug: 'free-fire' },
    update: {},
    create: {
      slug: 'free-fire',
      name: 'Free Fire',
      tagline: 'Ultimate Survival Shooter',
      publisher: 'Garena',
      imageUrl: 'https://example.com/ff.jpg',
      cardImage: 'https://example.com/ff-card.jpg',
      heroImage: 'https://example.com/ff-hero.jpg',
      isFeatured: true,
      sortOrder: 2,
      isLive: true,
    },
  });

  const game3 = await prisma.game.upsert({
    where: { slug: 'mobile-legends' },
    update: {},
    create: {
      slug: 'mobile-legends',
      name: 'Mobile Legends',
      tagline: '5v5 MOBA Game',
      publisher: 'Moonton',
      imageUrl: 'https://example.com/mlbb.jpg',
      cardImage: 'https://example.com/mlbb-card.jpg',
      heroImage: 'https://example.com/mlbb-hero.jpg',
      isFeatured: false,
      sortOrder: 3,
      isLive: true,
    },
  });

  console.log('✅ Sample games created');

  // Create packages for PUBG Mobile
  await prisma.package.createMany({
    data: [
      {
        gameId: game1.id,
        label: '60 UC',
        amount: 60,
        bonus: 0,
        priceLkr: 150,
        badge: 'Popular',
        isActive: true,
        sortOrder: 1,
      },
      {
        gameId: game1.id,
        label: '325 UC',
        amount: 325,
        bonus: 25,
        priceLkr: 750,
        badge: 'Best Value',
        isActive: true,
        sortOrder: 2,
      },
      {
        gameId: game1.id,
        label: '660 UC',
        amount: 660,
        bonus: 60,
        priceLkr: 1500,
        isActive: true,
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  // Create packages for Free Fire
  await prisma.package.createMany({
    data: [
      {
        gameId: game2.id,
        label: '100 Diamonds',
        amount: 100,
        bonus: 0,
        priceLkr: 120,
        badge: 'Popular',
        isActive: true,
        sortOrder: 1,
      },
      {
        gameId: game2.id,
        label: '310 Diamonds',
        amount: 310,
        bonus: 40,
        priceLkr: 350,
        badge: 'Best Value',
        isActive: true,
        sortOrder: 2,
      },
      {
        gameId: game2.id,
        label: '520 Diamonds',
        amount: 520,
        bonus: 80,
        priceLkr: 600,
        isActive: true,
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Sample packages created');

  // Create promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: 'Welcome bonus - 10% off',
        kind: PromoKind.percent,
        value: 10,
        minSpendLkr: 100,
        isActive: true,
      },
      {
        code: 'SAVE 50',
        description: 'Save 50 LKR on your order',
        kind: PromoKind.fixed,
        value: 50,
        minSpendLkr: 200,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Promo codes created');

  // Create FAQs
  await prisma.faq.createMany({
    data: [
      {
        question: 'How do I receive my game currency?',
        answer: 'After your order is confirmed, the game currency will be sent to your in-game ID within 5-30 minutes.',
        category: 'Orders',
        sortOrder: 1,
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, eZ Cash, Frimi, and wallet payments.',
        category: 'Payments',
        sortOrder: 2,
      },
      {
        question: 'Is my account information safe?',
        answer: 'Yes, we use industry-standard encryption and never share your information with third parties.',
        category: 'Security',
        sortOrder: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ FAQs created');

  // Create announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Welcome to HASA Gold Store!',
        body: 'Your trusted source for game currency. Fast delivery, secure payments, and 24/7 support.',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Announcements created');

  // Create system settings
  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      maintenanceEnabled: false,
      maintenanceMessage: '',
      securityLockEnabled: false,
      securityLockMessage: '',
    },
  });

  console.log('✅ System settings created');

  // Create default payment methods
  const defaultMethods = [
    { slug: 'card', label: 'Credit / Debit Card', description: 'Secure card payments', sortOrder: 1 },
    { slug: 'wallet', label: 'Wallet Balance', description: 'Pay using your HASA wallet', sortOrder: 2 },
    { slug: 'ez_cash', label: 'eZ Cash', description: 'Instant mobile payments', sortOrder: 3 },
    { slug: 'frimi', label: 'Frimi', description: 'Pay via Frimi app', sortOrder: 4 },
    { slug: 'bank_transfer', label: 'Bank Transfer', description: 'Direct bank deposit', sortOrder: 5 },
  ];

  for (const m of defaultMethods) {
    await prisma.paymentMethod.upsert({ where: { slug: m.slug }, update: {}, create: m });
  }

  console.log('✅ Payment methods created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

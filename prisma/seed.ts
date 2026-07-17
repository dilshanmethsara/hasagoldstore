import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // ── System Settings ───────────────────────────────────────────────────────
  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      maintenanceEnabled: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
      securityLockEnabled: false,
      securityLockMessage: 'Your account has been temporarily locked for security reasons.',
    },
  })
  console.log('✅ System settings seeded')

  // ── Games ────────────────────────────────────────────────────────────────
  const games = await Promise.all([
    prisma.game.upsert({
      where: { slug: 'free-fire' },
      update: {},
      create: {
        slug: 'free-fire',
        name: 'Free Fire',
        tagline: 'Battle royale at its finest',
        publisher: 'Garena',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        cardImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
        popularity: 100,
        isFeatured: true,
        sortOrder: 1,
        isLive: true,
      },
    }),
    prisma.game.upsert({
      where: { slug: 'pubg-mobile' },
      update: {},
      create: {
        slug: 'pubg-mobile',
        name: 'PUBG Mobile',
        tagline: 'The original battle royale',
        publisher: 'Krafton',
        imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800',
        cardImage: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400',
        heroImage: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=1200',
        popularity: 95,
        isFeatured: true,
        sortOrder: 2,
        isLive: true,
      },
    }),
    prisma.game.upsert({
      where: { slug: 'mobile-legends' },
      update: {},
      create: {
        slug: 'mobile-legends',
        name: 'Mobile Legends: Bang Bang',
        tagline: '5v5 MOBA action',
        publisher: 'Moonton',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
        cardImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        heroImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
        popularity: 90,
        isFeatured: true,
        sortOrder: 3,
        isLive: true,
      },
    }),
    prisma.game.upsert({
      where: { slug: 'blood-strike' },
      update: {},
      create: {
        slug: 'blood-strike',
        name: 'Blood Strike',
        tagline: 'Fast-paced FPS action',
        publisher: 'Vulkan',
        imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0c?w=800',
        cardImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0c?w=400',
        heroImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0c?w=1200',
        popularity: 75,
        isFeatured: false,
        sortOrder: 4,
        isLive: true,
      },
    }),
  ])
  console.log(`✅ ${games.length} games seeded`)

  // ── Packages ─────────────────────────────────────────────────────────────
  const freeFire = games.find(g => g.slug === 'free-fire')!
  const pubgMobile = games.find(g => g.slug === 'pubg-mobile')!
  const mobileLegends = games.find(g => g.slug === 'mobile-legends')!
  const bloodStrike = games.find(g => g.slug === 'blood-strike')!

  await Promise.all([
    // Free Fire Packages
    prisma.package.createMany({
      data: [
        { gameId: freeFire.id, label: '100 Diamonds', amount: 100, bonus: 0, priceLkr: 150, sortOrder: 1 },
        { gameId: freeFire.id, label: '310 Diamonds', amount: 310, bonus: 10, priceLkr: 450, sortOrder: 2 },
        { gameId: freeFire.id, label: '520 Diamonds', amount: 520, bonus: 25, priceLkr: 750, sortOrder: 3 },
        { gameId: freeFire.id, label: '1060 Diamonds', amount: 1060, bonus: 60, priceLkr: 1500, sortOrder: 4, badge: 'POPULAR' },
        { gameId: freeFire.id, label: '2180 Diamonds', amount: 2180, bonus: 120, priceLkr: 3000, sortOrder: 5 },
        { gameId: freeFire.id, label: '5600 Diamonds', amount: 5600, bonus: 400, priceLkr: 7500, sortOrder: 6, badge: 'BEST VALUE' },
      ],
      skipDuplicates: true,
    }),
    // PUBG Mobile Packages
    prisma.package.createMany({
      data: [
        { gameId: pubgMobile.id, label: '60 UC', amount: 60, bonus: 0, priceLkr: 200, sortOrder: 1 },
        { gameId: pubgMobile.id, label: '325 UC', amount: 325, bonus: 25, priceLkr: 1000, sortOrder: 2 },
        { gameId: pubgMobile.id, label: '660 UC', amount: 660, bonus: 60, priceLkr: 2000, sortOrder: 3, badge: 'POPULAR' },
        { gameId: pubgMobile.id, label: '1800 UC', amount: 1800, bonus: 200, priceLkr: 5000, sortOrder: 4 },
        { gameId: pubgMobile.id, label: '3850 UC', amount: 3850, bonus: 450, priceLkr: 10000, sortOrder: 5, badge: 'BEST VALUE' },
      ],
      skipDuplicates: true,
    }),
    // Mobile Legends Packages
    prisma.package.createMany({
      data: [
        { gameId: mobileLegends.id, label: '86 Diamonds', amount: 86, bonus: 0, priceLkr: 150, sortOrder: 1 },
        { gameId: mobileLegends.id, label: '172 Diamonds', amount: 172, bonus: 10, priceLkr: 300, sortOrder: 2 },
        { gameId: mobileLegends.id, label: '257 Diamonds', amount: 257, bonus: 20, priceLkr: 450, sortOrder: 3 },
        { gameId: mobileLegends.id, label: '344 Diamonds', amount: 344, bonus: 35, priceLkr: 600, sortOrder: 4, badge: 'POPULAR' },
        { gameId: mobileLegends.id, label: '516 Diamonds', amount: 516, bonus: 60, priceLkr: 900, sortOrder: 5 },
        { gameId: mobileLegends.id, label: '858 Diamonds', amount: 858, bonus: 120, priceLkr: 1500, sortOrder: 6, badge: 'BEST VALUE' },
      ],
      skipDuplicates: true,
    }),
    // Blood Strike Packages
    prisma.package.createMany({
      data: [
        { gameId: bloodStrike.id, label: '100 Gold', amount: 100, bonus: 0, priceLkr: 100, sortOrder: 1 },
        { gameId: bloodStrike.id, label: '500 Gold', amount: 500, bonus: 50, priceLkr: 450, sortOrder: 2 },
        { gameId: bloodStrike.id, label: '1000 Gold', amount: 1000, bonus: 150, priceLkr: 800, sortOrder: 3, badge: 'POPULAR' },
        { gameId: bloodStrike.id, label: '2500 Gold', amount: 2500, bonus: 500, priceLkr: 1800, sortOrder: 4, badge: 'BEST VALUE' },
      ],
      skipDuplicates: true,
    }),
  ])
  console.log('✅ Packages seeded')

  // ── Promo Codes ───────────────────────────────────────────────────────────
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: 'First order discount',
        kind: 'percent',
        value: 10,
        minSpendLkr: 500,
        isActive: true,
      },
      {
        code: 'HASA2024',
        description: 'Special promo code',
        kind: 'percent',
        value: 15,
        minSpendLkr: 1000,
        isActive: true,
      },
      {
        code: 'FLAT100',
        description: 'Flat discount',
        kind: 'fixed',
        value: 100,
        minSpendLkr: 1000,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Promo codes seeded')

  // ── FAQs ─────────────────────────────────────────────────────────────────
  await prisma.faq.createMany({
    data: [
      {
        question: 'How long does delivery take?',
        answer: 'Most orders are delivered within 5-15 minutes after payment confirmation. Some orders may take up to 24 hours depending on the game and server status.',
        category: 'Orders',
        sortOrder: 1,
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, eZ Cash, Frimi, bank transfers, and wallet payments. All payments are secure and processed instantly.',
        category: 'Payments',
        sortOrder: 2,
      },
      {
        question: 'Is it safe to buy from HASA GOLD STORE?',
        answer: 'Yes, we are a trusted store with thousands of satisfied customers. We use secure payment gateways and never store your payment information.',
        category: 'Security',
        sortOrder: 3,
      },
      {
        question: 'What should I do if I dont receive my order?',
        answer: 'If you dont receive your order within 24 hours, please contact our support team with your order number. We will investigate and resolve the issue promptly.',
        category: 'Orders',
        sortOrder: 4,
      },
      {
        question: 'Can I get a refund?',
        answer: 'Refunds are processed on a case-by-case basis. If there is an issue with your order, please contact support within 48 hours of purchase.',
        category: 'Refunds',
        sortOrder: 5,
      },
      {
        question: 'Do you offer discounts for bulk orders?',
        answer: 'Yes, we offer special discounts for bulk orders. Contact our support team with your requirements for a custom quote.',
        category: 'Pricing',
        sortOrder: 6,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ FAQs seeded')

  // ── Announcements ────────────────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Welcome to HASA GOLD STORE!',
        body: 'Your one-stop shop for game top-ups. Fast delivery, secure payments, and 24/7 support.',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Announcements seeded')

  // ── Blog Posts ───────────────────────────────────────────────────────────
  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'how-to-top-up-free-fire',
        title: 'How to Top Up Free Fire Diamonds',
        excerpt: 'A complete guide to purchasing Free Fire diamonds safely and instantly.',
        body: 'Top up your Free Fire diamonds in just a few simple steps...',
        coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        slug: 'best-payment-methods',
        title: 'Best Payment Methods for Game Top-Ups',
        excerpt: 'Learn about the different payment options available and which one suits you best.',
        body: 'Choosing the right payment method is crucial for a smooth experience...',
        coverUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800',
        isPublished: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  })
  console.log('✅ Blog posts seeded')

  // ── Admin User ─────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hasastore.com' },
    update: {},
    create: {
      email: 'admin@hasastore.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NUyBh5X5y1iW', // admin123
      roles: ['ADMIN'],
      status: 'active',
      emailVerified: true,
      phoneVerified: false,
    },
  })

  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {
      displayName: 'Admin',
      username: 'admin',
    },
    create: {
      userId: adminUser.id,
      displayName: 'Admin',
      username: 'admin',
      status: 'active',
    },
  })
  console.log('✅ Admin user seeded')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

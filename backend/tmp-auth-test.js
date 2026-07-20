require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = global.fetch || require('node-fetch');

(async () => {
  const prisma = new PrismaClient();
  const hashed = await bcrypt.hash('Password123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'test+phone@hasagold.store' },
    update: { password: hashed, emailVerified: true, phoneVerified: false, status: 'active' },
    create: { email: 'test+phone@hasagold.store', password: hashed, emailVerified: true, phoneVerified: false, roles: ['USER'], status: 'active' },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, roles: user.roles, status: user.status },
    process.env.AUTH_SECRET,
    { expiresIn: '7d' },
  );

  console.log('TOKEN', token);

  const res = await fetch('http://localhost:3001/auth/verify-phone/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phone: '+94775352074' }),
  });

  console.log('STATUS', res.status);
  const text = await res.text();
  console.log('BODY', text);

  await prisma.$disconnect();
})();

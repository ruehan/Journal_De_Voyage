// /api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 로그인 처리

    const {
        body: { email, password}
    } = req;
    
    // 데이터베이스에서 사용자 찾기 (여기서는 Prisma를 사용)
    const user = await prisma.user.findUnique({
      where: { 
        email: email
       }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) { // 실제로는 해시된 비밀번호를 비교해야 함
      return res.status(401).json({ error: 'Invalid password' });
    }

    // 세션 설정
    req.session.set('user', {
      id: user.id,
      name: user.name,
      email: user.email,
    });
    
    await req.session.save();

    return res.status(200).json({ message: 'Logged in successfully' });
  }

  return res.status(405).end();
}

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long", // 환경변수에서 비밀 키 가져오기
  cookieName: 'MY_APP_COOKIE',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});

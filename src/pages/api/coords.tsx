// /api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 로그인 처리
    const {
        body: { latitude, longitude }
    } = req;

    console.log(latitude, longitude)
    
    // 세션 설정
    req.session.set('coords', {
      latitude: latitude,
      longitude: longitude,
    });
    
    await req.session.save();

    return res.status(200).json({ message: 'Set Coords Success.' });
  }

  return res.status(405).end();
}

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long", // 환경변수에서 비밀 키 가져오기
  cookieName: 'COORDS_SESSION',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});

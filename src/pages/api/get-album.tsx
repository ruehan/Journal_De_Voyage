// /api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 로그인 처리

    const email = req.session.get("user").email;

    console.log(email)
    
    const albums = await prisma.album.findMany({
      where: { 
        email: email
       }
    });

    console.log(albums)

    if (!albums) {
      return res.status(404).json({ error: 'Album not found' });
    }

    return res.status(200).json({ albums: albums });
}

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long", // 환경변수에서 비밀 키 가져오기
  cookieName: 'MY_APP_COOKIE',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});

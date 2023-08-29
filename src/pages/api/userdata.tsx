// pages/api/some-route.js
import { withIronSession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.get("user");

  if (user) {
    res.status(200).json({ loggedIn: true, user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
}

export default withIronSession(handler, {
    password: "complex_password_at_least_32_characters_long", // 환경변수에서 비밀 키 가져오기
    cookieName: 'MY_APP_COOKIE',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });

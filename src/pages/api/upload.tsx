
import { withIronSession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
})


const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = upload.single('image');

    const coords = req.session.get("coords");

    console.log(coords)

    form(req, res, async (err) => {
      if (err) {
        return res.status(500).end();
      }

      const { title, content } = req.body;
      const image = path.join('uploads', req.file.filename);

      try {
        const email = "ruehan98@gmail.com";
        const latitude = coords.latitude;
        const longitude = coords.longitude;

        

        const pin = await prisma.pin.create({
          data: {
            title,
            content,
            image,
            email,
            latitude,
            longitude,
          },
        });

        console.log(pin)

        res.status(200).json({ success: true });
      } catch (e) {
        fs.unlink(image, (err) => {
          if (err) console.error('Failed to delete image:', err);
        });
        res.status(500).json({ success: false });
      }
    });
  } else {
    res.status(405).end();
  }
};

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long", // 환경변수에서 비밀 키 가져오기
  cookieName: 'COORDS_SESSION',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
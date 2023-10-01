
import { withIronSession } from "next-iron-session";
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs, { existsSync, mkdirSync } from 'fs';


const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  }),
  limits: {fileSize: 100 * 1024 * 1024}  
})

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.array('images');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

    uploadMiddleware(req, res, async (err) => {
      if(err){
        return res.status(400).json({error: err.message})
      }

      console.log(req.files)

      const { title, content, album } = req.body;
      const imagePaths = (req.files as Express.Multer.File[]).map((file) => file.path)

      const coords = req.session.get("coords");
      const email = coords.email;
      const latitude = coords.latitude;
      const longitude = coords.longitude;

      console.log(imagePaths)

        const pin = await prisma.pin.create({
          data: {
            title,
            content,
            image : imagePaths.join(","),
            album,
            email,
            latitude,
            longitude,
          },
        });

        res.status(200).json({ message: pin })
    })
  } else{
    res.status(405).send('Method Not Allowed');
  }
}

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long", // 환경변수에서 비밀 키 가져오기
  cookieName: 'COORDS_SESSION',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
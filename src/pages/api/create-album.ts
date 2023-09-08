import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST'){
        const { album, email } = req.body;

        console.log(album, email)

        try{
            const albums = await prisma.album.create({
                data: { 
                    email: email,
                    album: album
                }
            })
            return res.status(200).json(albums)
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong' })
        }
    } else {
        return res.status(405).end()
    }
}
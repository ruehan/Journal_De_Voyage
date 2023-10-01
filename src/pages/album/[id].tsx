import { useRouter } from 'next/router'
import moment from 'moment'
import type { NextPage } from 'next';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import Link from 'next/link'

interface AlbumInfo {
    albums: any;
  }

function unix_timestamp(t: moment.MomentInput){  
    return moment(t).format('YYYY-MM-DD HH:mm:ss')
}

const fetcher = async (url: string): Promise<AlbumInfo> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const Post: NextPage = () => {
    const router = useRouter()
    const { data, error } = useSWR<AlbumInfo>('/api/get-pin', fetcher);
    const { id } = router.query

    const [image, setImage] = useState<string[]>([])
    const [album, setAlbum] = useState<any>([])

    useEffect(() => {
        console.log("!")
        if(data){
            data.albums.map((album: any) => {
                if(album.id == id) {
                    console.log(album)
                    setAlbum(album)                 
                }
                if(album.image !== undefined && album.id == id){
                    console.log(album.image)
                    setImage(album.image.split(","))
                }
            })        
        }
    }, [data])
  
    if(!album) return <div>Loading...</div>

    return (
        <>
            <Link href="/album" className="w-24 h-8 fixed top-4 left-4 bg-orange-200 border-2 border-orange-300 font-bold rounded-xl flex items-center justify-center">뒤로가기</Link>
            <Link href={`/share/${album.id}`} className="w-24 h-8 fixed top-16 left-4 bg-purple-200 border-2 border-purple-300 font-bold rounded-xl flex items-center justify-center">지도에서 보기</Link>

           <div className="flex flex-col items-center justify-center mt-16">
                <div className="font-bold text-sm text-orange-500">{album.album}</div>
                <div className="text-sm font-bold">{unix_timestamp(album.createdAt)}</div>
                <div className="text-2xl m-4 font-bold">{album.title}</div>
                <div className="font-bold">{album.content}</div>
                
                
                {image.map((img: string) => (
                    <>
                    <img key={album.id} src={img.replace('public', '')} width="90%" className="rounded-xl m-4" />
                    </>
                )
                )}
           </div>
        </>
    )
}
  
export default Post
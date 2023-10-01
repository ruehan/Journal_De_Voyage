import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Router, useRouter } from 'next/router';
import moment from "moment";
import Link from 'next/link'
// import styles from '../styles/Home.module.css';

interface AlbumInfo {
    albums: any;
  }

  interface LoginInfo {
    loggedIn: boolean;
    user?: any;
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

const user_fetcher = async (url: string): Promise<LoginInfo> => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    return res.json();
  };

const Album: NextPage = () => {

    const { data, error } = useSWR<AlbumInfo>('/api/get-pin', fetcher);
    const { data :user, error : userError } = useSWR<LoginInfo>('/api/userdata', user_fetcher);

    if (!data) return <div>Loading...</div>;

    console.log(data.albums)

    return (
        <>
            {user?.loggedIn ? (
                    <Link href="/main" className="w-24 h-12 sticky top-4 left-4 bg-orange-200 border-2 border-orange-300 font-bold rounded-xl z-10">Back</Link>
            ) : null}
            <div className="w-screen h-screen flex flex-wrap">
                {data.albums.map((album: any) => (
                    <Link href={`/album/${album.id}`} key={album.id} className="w-48 h-48 border-2 border-gray-200 rounded-xl flex flex-col m-2 p-4 relative" >
                        <div key={album.id}>{album.title}</div>
                        <div className="text-sm mt-2">{album.content}</div>
                        <div className="absolute bottom-2">
                            <div>{album.album}</div>
                            <div className="text-sm">{unix_timestamp(album.createdAt)}</div>
                        </div>
                    </Link>

                ))}
            </div>
        </>
    );
};

export default Album;
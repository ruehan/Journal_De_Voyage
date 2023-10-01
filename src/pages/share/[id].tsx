import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link'
// import styles from '../styles/Home.module.css';

interface LoginInfo {
  loggedIn: boolean;
  user?: any;
}

interface AlbumInfo {
  albums: any;
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

const Share: NextPage = () => {
    const router = useRouter();

    const { id } = router.query

  const { data: albumData, error: albumError } = useSWR<AlbumInfo>('/api/get-pin', fetcher);
  
  const libraries = useMemo(() => ['places'], []);

  const [hybrid, setHybrid] = useState<boolean>(false)
  const [fixed, setFixed] = useState<boolean>(false)

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [errormsg, setError] = useState<string | null>(null)

  if(!albumData) return <div>Loading...</div>
  if(location === null){
    albumData.albums.map((album: any) => {
        if(album.id == id) {
            console.log("Correct")
            setLocation({latitude: album.latitude, longitude: album.longitude})
        }
    })
  }

  console.log(albumData)
  console.log(location)

  return (
    <>
    <Link href="/album" className="w-24 h-8 fixed top-4 left-4 bg-orange-200 border-2 border-orange-300 font-bold rounded-xl flex items-center justify-center z-20">앨범으로</Link>
    <div className="flex flex-col items-center justify-center relative w-full">
      <div className="flex fixed top-0 left-0 z-10 w-full h-16 items-center justify-center">
      </div>
      {location && (
        <GoogleMap
        options={mapOptions}
        zoom={14}
        center={fixed ? null : {lat: location?.latitude, lng: location?.longitude}}
        mapTypeId={"roadmap"}
        mapContainerStyle={{ width: '100%', height: '90vh' }}
        onLoad={() => console.log('Map Component Loaded...')}
      >
        {albumData.albums.map((album: any) => (
          <MarkerF
            key={album.id}
            position={{lat: album.latitude, lng: album.longitude}}
            onClick={() => router.push(`/album/${album.id}`)}
            label={{text: album.title, color: "black", fontSize: "16px", fontWeight: "bold"}}
          />
        ))}
        </GoogleMap>
      )}
      
    </div>
    </>
  );
};

export default Share;
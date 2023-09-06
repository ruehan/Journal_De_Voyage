import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { HiSearch } from 'react-icons/hi';
import { FaSatellite } from 'react-icons/fa'
import { MdGpsFixed } from 'react-icons/md'
// import styles from '../styles/Home.module.css';

interface LoginInfo {
  loggedIn: boolean;
  user?: any;
}

const fetcher = async (url: string): Promise<LoginInfo> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const Home: NextPage = () => {

  const { data, error } = useSWR<LoginInfo>('/api/userdata', fetcher);

  const libraries = useMemo(() => ['places'], []);

  const [hybrid, setHybrid] = useState<boolean>(false)
  const [fixed, setFixed] = useState<boolean>(false)

  const router = useRouter()

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


  useEffect(() => {

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
        },
        (error) => {
          setError(error.message)
        }
      )

      
    }
  }, [])

  const clickCreate = async () => {

    console.log(location)

    const response = await fetch('/api/coords', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({latitude: location?.latitude, longitude: location?.longitude, email: data?.user?.email})
    })

    

    router.push("/create-trip")
  }

  const clickHybrid = () => {
    setHybrid(!hybrid)
    setFixed(true)
  }

  const clickGps = () => {
    setFixed(false)
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!data) return <div>Loading...</div>;

  console.log(data)

  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <div className="flex fixed top-0 left-0 z-10 w-full h-16 items-center justify-center">
        <div className="w-4/6 border-2 rounded-xl border-gray-200 bg-white h-12 relative flex items-center justify-between text-gray-400 p-4" onClick={clickCreate}>
          <p>앨범을 생성해주세요.</p>
          <HiSearch className="text-xl "/>
        </div>
      </div>
      {location && (
        <GoogleMap
        options={mapOptions}
        zoom={14}
        center={fixed ? null : {lat: location?.latitude, lng: location?.longitude}}
        mapTypeId={hybrid ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', height: '90vh' }}
        onLoad={() => console.log('Map Component Loaded...')}
      >
        <MarkerF
          position={{lat: location?.latitude, lng: location?.longitude}}
          onLoad={() => console.log('Marker Loaded...')} 
        />
        </GoogleMap>
      )}
      
      <div className="absolute top-1/4 h-36 flex flex-col justify-around right-4">
        <button className="bg-white w-12 h-12 rounded-2xl border-2 border-gray-200 flex justify-center items-center text-xl" onClick={clickHybrid}><FaSatellite className={`${hybrid ? 'text-orange-200' : 'text-black'}`}/></button>
        <button className="bg-white w-12 h-12 rounded-2xl border-2 border-gray-200 flex justify-center items-center text-xl" onClick={clickGps}><MdGpsFixed /></button>
      </div>
    </div>
  );
};

export default Home;
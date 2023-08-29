import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import Upload from './layout/Upload';
import useSWR from 'swr';
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


  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!data) return <div>Loading...</div>;

  console.log(data)

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold mt-12 mb-8">You are maybe here...</h1>
      </div>
      <Upload />
      {location && (
        <GoogleMap
        options={mapOptions}
        zoom={14}
        center={{lat: location?.latitude, lng: location?.longitude}}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '50vh', height: '60vh' }}
        onLoad={() => console.log('Map Component Loaded...')}
      >
        <MarkerF
          position={{lat: location?.latitude, lng: location?.longitude}}
          onLoad={() => console.log('Marker Loaded...')} 
        />
        </GoogleMap>
      )}
      
    </div>
  );
};

export default Home;
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
// import styles from '../styles/Home.module.css';


const Home: NextPage = () => {
  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );

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
  const [error, setError] = useState<string | null>(null)

  
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

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <p>lat : {location?.latitude}</p>
        <p>lng : {location?.longitude}</p>
        <h1 className="text-2xl font-bold mt-12 mb-12">You are maybe here...</h1>
      </div>
      {location && (
        <GoogleMap
        options={mapOptions}
        zoom={14}
        center={{lat: location?.latitude, lng: location?.longitude}}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '400px', height: '400px' }}
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
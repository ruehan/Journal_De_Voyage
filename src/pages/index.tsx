import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import Upload from './layout/Upload';
import useSWR from 'swr';
import { Router, useRouter } from 'next/router';
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

  const router = useRouter()

  if (!data) return <div>Loading...</div>;

  // if(data.loggedIn === true){
  //   router.push('/main')
  // }

  console.log(data.loggedIn)

  return (
    <div className="bg-[url('https://storage.googleapis.com/journal-de-voyage/background_1.png')] bg-cover flex flex-col items-center justify-center w-full h-screen overflow-hidden">
      <p className="mb-24 text-3xl text-white">Journal de Voyage</p>
      <div>
        <div className="bg-gray-200 m-4 w-48 h-12 text-xl flex items-center justify-center rounded-xl" onClick={() => router.push('/signup')}>Register</div>
        <div className="bg-gray-200 m-4 w-48 h-12 text-xl flex items-center justify-center rounded-xl" onClick={() => router.push('/login')}>Login</div>
      </div>

    </div>
  );
};

export default Home;
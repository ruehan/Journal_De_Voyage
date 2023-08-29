import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
// import styles from '../styles/Home.module.css';

type FormData = {
    username: string;
    email: string;
    password: string;
}

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const router = useRouter()
        
    const onSubmit = async (data: FormData) => {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        console.log(result)

        router.push('/login')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-screen items-center justify-center">

        <div className="flex flex-col text-xl mt-12">
            <label>Email</label>
            <input
            {...register('email', {
                required: 'Email is required',
                pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address'
                }
            })}
            className="mt-4 border-2 border-gray-200 h-12" />
            {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div className="flex flex-col text-xl mt-12 ">
            <label>Username</label>
            <input {...register('username', { required: true })} className="mt-4 border-2 border-gray-200 h-12" />
            {errors.username && <span>This field is required</span>}
        </div>
        <div className="flex flex-col text-xl mt-12">
            <label>Password</label>
            <input
            type="password"
            {...register('password', { required: true })}
            className="mt-4 border-2 border-gray-200 h-12" />
            {errors.password && <span>This field is required</span>}
        </div>
        <button type="submit" className="mt-4 border-2 border-gray-200 w-24 h-12 rounded-2xl">Sign up</button>
        </form>
    )
}

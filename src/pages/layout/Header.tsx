import { Router, useRouter } from "next/router"


function Header(){

    const router = useRouter()

    return(
        <div className="flex p-4 bg-gray-200 ">
            <div className="flex-auto text-center justify-center" onClick={() => router.push('/')}>Home</div>
            <div className="flex-auto text-center justify-center" onClick={() => router.push('/signup')}>Register</div>
            <div className="flex-auto text-center justify-center" onClick={() => router.push('/login')}>Login</div>
        </div>
    )
}

export default Header
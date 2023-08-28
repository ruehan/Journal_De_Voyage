import { Router, useRouter } from "next/router"

function Upload(){

    const router = useRouter()

    return(
        <div className="mt-4 mb-4 text-3xl bg-blue-200 w-12 h-12 text-white rounded-full flex justify-center items-center">
            <div onClick={() => router.push('/signup')}>+</div>
        </div>
    )
}

export default Upload
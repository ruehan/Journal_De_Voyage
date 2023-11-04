import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useSWR from 'swr';

type FormData = {
  title: string;
  content: string;
  images: FileList;
  album: string;
};

interface LoginInfo {
  loggedIn: boolean;
  user?: any;
}

interface AlbumInfo {
  album: any;
}

const fetcher = async (url: string): Promise<LoginInfo> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const fetcher_album = async (url: string): Promise<AlbumInfo> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const ImageUploadForm: React.FC = () => {

  const {register, handleSubmit} = useForm<FormData>();
  const [createAlbum, setCreateAlbum] = useState<boolean>(false);
  const [albumText, setAlbumText] = useState<string>("");
  const { data, error } = useSWR<LoginInfo>('/api/userdata', fetcher);
  const { data : albums, error : albumsError } = useSWR<AlbumInfo>('/api/get-album', fetcher_album);
  const { data : pins, error: pinsError } = useSWR<AlbumInfo>('/api/get-pin', fetcher_album);
  const router = useRouter();
  const {id} = router.query;

  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('album', data.album);

    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    })

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json();
    if(response.ok){
      alert('Upload Success');
      router.push('/main')
    }else{
      alert('Upload Fail');
    }
  }

  const clickCreateAlbum  =  () => {
    setCreateAlbum(!createAlbum)
  }

  const onCreateAlbum = async (albumName: string) => {
    
  }

  const clickAddAlbum = async () => {
    if(albumText === ""){
      alert('앨범 이름을 입력해주세요')
      return;
    }else{
      alert(`[${albumText}] 앨범이 추가되었습니다.`)
      setCreateAlbum(!createAlbum)

      const response = await fetch('/api/create-album', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({album: albumText, email: data?.user.email})
      })
    }
  }

  const changeAlbumText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumText(e.target.value)
  }

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   const urls = files.map((file) => URL.createObjectURL(file));
  //   setSelectedImages(urls);
  // };


  if(!albums){
    return <div>Loading...</div>
  }

  if(!pins){
    return <div>Loading...</div>
  }

  console.log(pins)

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-xl bg-white relative flex flex-col items-center justify-center text-gray-400 p-4">
      <div className="flex w-4/6 items-center justify-center">
        <select {...register('album')}
        className="border-2 rounded-xl border-gray-200 h-12 w-5/6">
          <option value="" disabled>
            Select your Album
          </option>
          {albums.albums.map((album: any) => (
            <option key={album.id} value={album.album}>{album.album}</option>
          ))}
        </select>
        <div className="bg-green-100 h-12 w-12 rounded-full text-3xl ml-4 flex items-center justify-center" onClick={clickCreateAlbum}>+</div>
      </div>
      {
        pins.albums.map((pin: any) => (        
            pin.id == id ? (
              <>
              <input {...register('title')} value={pin.title} placeholder="Title" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>
              <input {...register('content')} value={pin.content} type="" placeholder="Content" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>
              <input {...register('images')} type="file" multiple className="w-4/6 border-2 rounded-xl border-gray-200 m-4" />
              </>   
            ) : null
          ))
      }
      <button type="submit" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4">Upload</button>
      {createAlbum && (
        <div className="w-5/6 h-1/6 absolute top-1/6 rounded-3xl backdrop-opacity-95 bg-white/90 border-2 border-gray-200 flex items-center justify-center">
          <input type="text" className="bg-gray-400 text-white h-1/2" onChange={changeAlbumText}></input>
          <div className="bg-gray-400 h-1/2 w-16 rounded-full text-md ml-4 flex items-center justify-center text-white" onClick={clickAddAlbum}>추가</div>
        </div>
      )}
      
    </form>
    <div className="flex flex-wrap w-screen">
      {selectedImages.map((url, index) => (
          <img 
            className="object-cover w-1/4 h-1/4 border-2 border-gray-200 rounded-xl"
            key={index}
            src={url} 
            alt={`Selected ${index}`} 
            width="100" 
            height="100" 
          />
        ))}
    </div>
    </>
);
};

export default ImageUploadForm;

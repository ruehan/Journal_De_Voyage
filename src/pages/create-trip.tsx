// components/ImageUploadForm.tsx
import { useForm } from 'react-hook-form';

type FormData = {
  image: FileList;
};

const ImageUploadForm: React.FC = () => {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData();
    const title = (e.currentTarget.title as HTMLInputElement).value;
    const content = (e.currentTarget.content as HTMLInputElement).value;
    const file = (e.currentTarget.file as HTMLInputElement).files?.[0];

    formData.append('title', title)
    formData.append('content', content)
    formData.append('file', file as Blob)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if(res.ok){
      alert('Uploaded successfully')
    }else{
      alert('Upload failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-xl bg-white relative flex flex-col items-center justify-center text-gray-400 p-4">
      <input type="text" placeholder="간단한 설명" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>  
      <input type="text" placeholder="자세한 내용" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4" />
      <input type="text" placeholder="경험 또는 느낀점" className="w-4/6 border-2 rounded-xl border-gray-200 h-36 m-4"></input>
      <input type="file" className="w-4/6 border-2 rounded-xl border-gray-200 m-4" />
      <button type="submit" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4">Upload</button>
    </form>
);
};

export default ImageUploadForm;

import { useForm } from 'react-hook-form';

type FormData = {
  title: string;
  content: string;
  image: FileList;
};

const ImageUploadForm: React.FC = () => {

  const {register, handleSubmit} = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('image', data.image[0]);

    console.log(formData)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json();

    if(response.ok){
      alert('Upload Success');
    }else{
      alert('Upload Fail');
    }
  }

  return (
    // <form className="w-full rounded-xl bg-white relative flex flex-col items-center justify-center text-gray-400 p-4">
    //   <input type="text" placeholder="간단한 설명" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>  
    //   <input type="text" placeholder="자세한 내용" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4" />
    //   <input type="text" placeholder="경험 또는 느낀점" className="w-4/6 border-2 rounded-xl border-gray-200 h-36 m-4"></input>
    //   <input type="file" className="w-4/6 border-2 rounded-xl border-gray-200 m-4" />
    //   <button type="submit" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4">Upload</button>
    // </form>

    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-xl bg-white relative flex flex-col items-center justify-center text-gray-400 p-4">
      <input {...register('title')} placeholder="Title" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>
      <input {...register('content')} placeholder="Content" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>
      <input {...register('image')} type="file" className="w-4/6 border-2 rounded-xl border-gray-200 m-4"/>
      <button type="submit" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4">Upload</button>
    </form>
);
};

export default ImageUploadForm;

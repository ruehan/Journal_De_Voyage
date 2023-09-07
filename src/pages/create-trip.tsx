import { useForm, Controller } from 'react-hook-form';

type FormData = {
  title: string;
  content: string;
  images: FileList;
  album: string;
};

const ImageUploadForm: React.FC = () => {

  const {register, handleSubmit} = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);

    Array.from(data.images).forEach((file) => {
      formData.append('images', file);
    })

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-xl bg-white relative flex flex-col items-center justify-center text-gray-400 p-4">
      <div className="flex w-4/6 items-center justify-center">
        <select {...register('album')}
        className="border-2 rounded-xl border-gray-200 h-12 w-5/6">
          <option value="" disabled>
            Select your Album
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div className="bg-green-100 h-12 w-12 rounded-full text-3xl ml-4 flex items-center justify-center">+</div>
      </div>
      <input {...register('title')} placeholder="Title" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>
      <input {...register('content')} placeholder="Content" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4"/>
      <input {...register('images')} type="file" multiple className="w-4/6 border-2 rounded-xl border-gray-200 m-4"/>
      <button type="submit" className="w-4/6 border-2 rounded-xl border-gray-200 h-12 m-4">Upload</button>
    </form>
);
};

export default ImageUploadForm;

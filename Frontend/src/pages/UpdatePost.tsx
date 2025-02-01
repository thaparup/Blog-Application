import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeUpdatePostZodSchema, UpdatePostZodSchema } from '../zod_schema/post.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'react-query';
import { FETCH_POST, UPDATE_POST } from '../utils/ApiRoutes';
import { FetchQuery, PatchQuery } from '../utils/ApiCall';
import toast, { Toaster } from 'react-hot-toast';

export default function UpdatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { postId } = useParams();

    const navigate = useNavigate();
    const { user } = useUserStore();



    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TypeUpdatePostZodSchema>({
        resolver: zodResolver(UpdatePostZodSchema),
    });
    const FetchPostById = async () => FetchQuery(`${FETCH_POST}?postId=${postId!}`)

    const { data: post } = useQuery('post', FetchPostById)
    console.log(post?.data?.posts[0].slug)
    const updatePostMutation = useMutation({
        mutationFn: async (val: TypeUpdatePostZodSchema) => {
            const formData = new FormData();
            formData.append("content", val.content);
            formData.append("category", val.category);
            formData.append("title", val.title);

            if (val.postImageFile && val.postImageFile[0]) {
                formData.append("postImageFile", val.postImageFile[0]);
            }

            try {
                await PatchQuery<TypeUpdatePostZodSchema>(
                    UPDATE_POST + `${postId!}/${user?._id}`,
                    formData as unknown as TypeUpdatePostZodSchema
                )
                    .then((res) => {
                        toast.success(res.message);
                        setTimeout(() => {
                            navigate(`/post/${post?.data?.posts[0].slug}`);
                            reset();
                        }, 2000);
                    })
                    .catch((err) => console.log(err));
            } catch (error) {
                console.error(error);
            }
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImageFileUrl(URL.createObjectURL(file));
        }
    };
    const onSubmitHandler: SubmitHandler<TypeUpdatePostZodSchema> = (data) => {
        updatePostMutation.mutate(data);

    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <Toaster position="top-right" />
            <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmitHandler)}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type="text"
                        placeholder="Title"
                        id="title"
                        className="flex-1"
                        {...register("title")}
                        defaultValue={post?.data?.posts[0].title}
                    />

                    <Select {...register("category")} defaultChecked={post?.data?.posts[0].category}>
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                    </Select>
                </div>
                {errors.category && typeof errors.category.message === "string" && (
                    <span className="text-red-500 text-sm">
                        {errors.category.message}
                    </span>
                )}
                {errors.title && typeof errors.title.message === "string" && (
                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                )}
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <input
                        type="file"
                        {...register("postImageFile")}
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        gradientDuoTone="purpleToBlue"
                        size="sm"
                        outline
                    >
                        Upload
                    </Button>
                </div>
                {errors.postImageFile &&
                    typeof errors.postImageFile.message === "string" && (
                        <span className="text-red-500 text-sm">
                            {errors.postImageFile.message}
                        </span>
                    )}
                {imageFileUrl && (
                    <img
                        src={imageFileUrl}
                        alt="upload"
                        className="w-full h-72 object-cover"
                    />
                )}

                {errors.content && typeof errors.content.message === "string" && (
                    <span className="text-red-500 text-sm">{errors.content.message}</span>
                )}

                <ReactQuill
                    theme="snow"
                    placeholder="Write something..."
                    className="h-72 mb-12"
                    onChange={(value) => {
                        setValue("content", value);
                    }}
                    defaultValue={post?.data?.posts[0].content}
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Update post
                </Button>

            </form>
        </div>
    );
}
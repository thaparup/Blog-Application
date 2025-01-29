import { Button, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    CreatePostZodSchema,
    TypeCreatePostZodSchema,
} from "../zod_schema/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { PostQuery } from "../utils/ApiCall";
import { CREATE_POST } from "../utils/ApiRoutes";
import { useMutation } from "react-query";

export default function CreatePost() {
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TypeCreatePostZodSchema>({
        resolver: zodResolver(CreatePostZodSchema),
    });

    const createPostMutation = useMutation({
        mutationFn: async (val: TypeCreatePostZodSchema) => {
            const formData = new FormData();
            formData.append("content", val.content);
            formData.append("category", val.category);
            formData.append("title", val.title);

            if (val.postImageFile && val.postImageFile[0]) {
                formData.append("postImageFile", val.postImageFile[0]);
            }

            try {
                await PostQuery<TypeCreatePostZodSchema>(
                    CREATE_POST,
                    formData as unknown as TypeCreatePostZodSchema
                )
                    .then((res) => {
                        toast.success(res.message);
                        reset();
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
    const onSubmitHandler: SubmitHandler<TypeCreatePostZodSchema> = (data) => {
        createPostMutation.mutate(data);

    };

    //     try {
    //         if (!file) {
    //             setImageUploadError('Please select an image');
    //             return;
    //         }
    //         setImageUploadError(null);
    //         const storage = getStorage(app);
    //         const fileName = new Date().getTime() + '-' + file.name;
    //         const storageRef = ref(storage, fileName);
    //         const uploadTask = uploadBytesResumable(storageRef, file);
    //         uploadTask.on(
    //             'state_changed',
    //             (snapshot) => {
    //                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 setImageUploadProgress(parseInt(progress.toFixed(0)));
    //             },
    //             (error) => {
    //                 setImageUploadError('Image upload failed');
    //                 setImageUploadProgress(null);
    //             },
    //             () => {
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                     setImageUploadProgress(null);
    //                     setImageUploadError(null);
    //                     // setFormData({ ...formData, image: downloadURL });
    //                 });
    //             }
    //         );
    //     } catch (error) {
    //         setImageUploadError('Image upload failed');
    //         setImageUploadProgress(null);
    //         console.log(error);
    //     }
    // };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         const res = await fetch('/api/post/create', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(formData),
    //         });
    //         const data = await res.json();
    //         if (!res.ok) {
    //             setPublishError(data.message);
    //             return;
    //         }

    //         if (res.ok) {
    //             setPublishError(null);
    //             navigate(`/post/${data.slug}`);
    //         }
    //     } catch (error) {
    //         setPublishError('Something went wrong');
    //     }
    // };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <Toaster position="top-right" />
            <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmitHandler)}
            >
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title"
                        id="title"
                        className="flex-1"
                        {...register("title")}
                    />

                    <Select {...register("category")}>
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
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
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
                />
                <Button type="submit" gradientDuoTone="purpleToPink">
                    Publish
                </Button>
            </form>
        </div>
    );
}

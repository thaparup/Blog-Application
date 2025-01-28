import React from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { PostQuery } from "./../../utils/ApiCall"
import { TRY } from '../../utils/ApiRoutes'
import { Alert, Button, Spinner, TextInput } from 'flowbite-react';

const Try = () => {

    const schema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters long"),
        profilePicture: z
            .instanceof(FileList)
            .optional()  // Make profilePicture optional
            .refine((fileList) => {
                // Skip validation if no file is provided (fileList is empty or undefined)
                if (!fileList || fileList.length === 0) return true;

                // Validate file size if file is selected
                return fileList[0]?.size <= 5 * 1024 * 1024;
            }, {
                message: "File size must be less than 5MB",
            })
            .refine((fileList) => {
                // Skip validation if no file is provided (fileList is empty or undefined)
                if (!fileList || fileList.length === 0) return true;

                // Validate file type if file is selected
                return ["image/jpeg", "image/png"].includes(fileList[0]?.type);
            }, {
                message: "Only JPG and PNG images are allowed",
            }),
    });


    type FormData = {
        username: string,
        profilePicture: File
    }
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });



    const updateUserMutation = useMutation({
        mutationFn: async (val) => {
            try {

                PostQuery<FormData>(TRY, val!).then((res) => {
                    console.log(res)
                })
            } catch (error) {
                console.log(error)

            }
        }
    })
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const formData = new FormData();
        formData.append('username', data.username);

        // Handle the file input here if it's available
        if (data.profilePicture && data.profilePicture[0]) {
            formData.append('profilePicture', data.profilePicture[0]);
        }

        try {
            // Send data via fetch (you can use Axios too)
            const response = await fetch(TRY, {
                method: 'POST',
                body: formData, // Sending form data with the file
            });

            const result = await response.json();
            console.log('Response:', result);
        } catch (error) {
            console.error('Error uploading:', error);
        }
    };


    return (
        <div>
            <h1>try</h1>
            <form action="" onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <input type="text" {...register('username')} placeholder='username' />
                {errors.username && typeof errors.username.message === 'string' && (
                    <Alert color='failure' className='mt-5'>
                        {errors.username?.message}
                    </Alert>
                )}
                <label htmlFor="">File</label>
                <input
                    type="file"
                    {...register("profilePicture")}
                />
                {errors.profilePicture && typeof errors.profilePicture.message === 'string' && (
                    <Alert color='failure' className='mt-5'>
                        {errors.profilePicture?.message}
                    </Alert>
                )}
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Try
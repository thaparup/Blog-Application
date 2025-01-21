import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import React, { MouseEventHandler, useState } from "react";
import { data, Link } from "react-router-dom"
import { useForm, SubmitHandler } from 'react-hook-form'
import { TypeRegisterUserZodSchema, RegisterUserZodSchema } from "../zod_schema/user.schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from "react-query";
import { PostQuery } from "../utils/ApiCall";
import { REGISTER } from "../utils/ApiRoutes";
const SignUp = () => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TypeRegisterUserZodSchema>({ resolver: zodResolver(RegisterUserZodSchema) })


    const registerUserMutation = useMutation({
        mutationFn: async (val: TypeRegisterUserZodSchema) => {
            try {
                setLoading(true)
                PostQuery<TypeRegisterUserZodSchema, TypeRegisterUserZodSchema>(REGISTER, val).then((res) => {
                    console.log(res)
                    setLoading(false)
                })
            } catch (error) {
                console.log(error)
                setLoading(false)

            }
        }
    })
    const onSubmitHandler: SubmitHandler<TypeRegisterUserZodSchema> = (data) => {
        try {
            registerUserMutation.mutate(data);
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    }
    return (
        <div className=''>
            <div className='flex p-3 mt-40 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
                {/* left */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Tech
                        </span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>
                        Welcome to the Tech Blog. You can sign up with your email and password
                        or with Google.
                    </p>
                </div>
                {/* right */}

                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmitHandler)}>
                        <div>
                            <Label value='Your username' />
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username'
                                {...register("username")}
                            />
                            {errors.username && typeof errors.username.message === 'string' && (
                                <span className="text-red-500 text-sm">{errors.username.message}</span>
                            )}

                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                {...register("email")}

                            />
                            {errors.email && typeof errors.email.message === 'string' && (
                                <span className="text-red-500 text-sm">{errors.email.message}</span>
                            )}

                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password'
                                {...register("password")}

                            />
                            {errors.password && typeof errors.password.message === 'string' && (
                                <span className="text-red-500 text-sm">{errors.password.message}</span>
                            )}

                        </div>
                        <Button
                            gradientDuoTone='purpleToPink'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignUp
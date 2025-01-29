import { Alert, Button, Spinner, TextInput, Modal, ModalBody } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import {
    TypeRegisterUserZodSchema,
    TypeUpdateUserZodSchema,
    UpdateUserZodSchema,
} from "../zod_schema/user.schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { DeleteQuery, PatchQuery, PostQuery } from "../utils/ApiCall";
import { DELETE_USER, LOGOUT, UPDATE_USER_PROFILE } from "../utils/ApiRoutes";
import { z } from "zod";
import { BsFillArrowDownRightSquareFill } from "react-icons/bs";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";
export default function DashProfile() {
    const nav = useNavigate()
    const { user, setUser, clearUserAndAccessToken, isTokenExpired, accessToken } = useUserStore();
    const [showModal, setShowModal] = useState(false);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const handleDeleteUser = async () => {
        setShowModal(false);
        DeleteQuery(DELETE_USER + `${user?._id}`)
            .then((res) => {
                console.log(res.message);
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                clearUserAndAccessToken()
                isTokenExpired(accessToken!)
                nav('/sign-in')

            })
            .catch((error) => {
                console.error(error);
            });
    };


    const handleSignout = () => {
        PostQuery(LOGOUT)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        clearUserAndAccessToken()
        isTokenExpired(accessToken!)
        nav('/sign-in')


    };
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TypeUpdateUserZodSchema>({
        resolver: zodResolver(UpdateUserZodSchema),
    });

    const updateUserMutation = useMutation({
        mutationFn: async (val: TypeUpdateUserZodSchema) => {
            const formData = new FormData();
            formData.append("username", val.username);
            formData.append("email", val.email);
            formData.append("password", val.password);

            if (val.profilePictureFile && val.profilePictureFile[0]) {
                formData.append("profilePictureFile", val.profilePictureFile[0]);
            }

            try {
                setLoading(true);
                await PatchQuery<TypeUpdateUserZodSchema>(
                    UPDATE_USER_PROFILE + `${user?._id}`,
                    formData as unknown as TypeUpdateUserZodSchema
                )
                    .then((res) => {
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        setUser(res.data.user);

                        setImageFileUrl(res.data.user.profilePicture);
                    })
                    .catch((err) => console.log(err));

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        },
    });
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImageFileUrl(URL.createObjectURL(file));
        }
    };
    const onSubmit: SubmitHandler<TypeUpdateUserZodSchema> = (data) => {
        updateUserMutation.mutate(data); // Pass the data in the correct shape
    };
    useEffect(() => {
        setImageFileUrl(user?.profilePicture!);
    }, [user]);
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="file"
                    {...register("profilePictureFile")}
                    onChange={handleFileChange}
                />
                {errors.profilePictureFile &&
                    typeof errors.profilePictureFile.message === "string" && (
                        <Alert color="failure" className="mt-5">
                            {errors.profilePictureFile?.message}
                        </Alert>
                    )}
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img
                        src={imageFileUrl!}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] `}
                    />
                </div>

                <TextInput
                    type="text"
                    {...register("username")}
                    placeholder="username"
                    defaultValue={user?.username}
                />
                {errors.username && typeof errors.username.message === "string" && (
                    <Alert color="failure" className="mt-5">
                        {errors.username?.message}
                    </Alert>
                )}
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={user?.email}
                    disabled
                    {...register("email")}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="password"
                    {...register("password")}
                />
                {errors.password && typeof errors.password.message === "string" && (
                    <Alert color="failure" className="mt-5">
                        {errors.password?.message}
                    </Alert>
                )}
                <Button
                    gradientDuoTone="purpleToBlue"
                    outline
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                        </>
                    ) : (
                        "Update"
                    )}
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer" onClick={() => setShowModal(true)}> Delete Account</span>
                <span className="cursor-pointer" onClick={() => handleSignout()}>Sign Out</span>
            </div>


            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>

        </div>
    );
}

import { Alert, Button, Spinner, TextInput } from "flowbite-react";
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
import { PatchQuery, PostQuery } from "../utils/ApiCall";
import { UPDATE_USER_PROFILE } from "../utils/ApiRoutes";
import { z } from "zod";
import { BsFillArrowDownRightSquareFill } from "react-icons/bs";

export default function DashProfile() {

    const { user, setUser } = useUserStore();

    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

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
                        console.log(res)
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
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
        </div>
    );
}

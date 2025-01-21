import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    SigninUserZodSchema,
    TypeSigninUserZodSchema,
} from "../zod_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { PostQuery } from "../utils/ApiCall";
import { SIGNIN } from "../utils/ApiRoutes";
import { userStore } from "../store/userStore";

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = userStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TypeSigninUserZodSchema>({
        resolver: zodResolver(SigninUserZodSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (val: TypeSigninUserZodSchema) => {
            try {
                setLoading(true);
                await PostQuery<TypeSigninUserZodSchema>(SIGNIN, val)
                    .then((res) => {
                        setLoading(false);

                        setUser(res);
                        console.log(res);
                        reset({ email: "", password: "" });
                        navigate("/dashboard");
                    })
                    .catch((err) => console.log(err));
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        },
    });

    const onSubmitHandler: SubmitHandler<TypeSigninUserZodSchema> = (data) => {
        try {
            loginMutation.mutate(data);
        } catch (error) {
            console.error("An error occurred during login:", error);
        }
    };
    return (
        <div className="min-h-screen translate-y-[200px]">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* left */}
                <div className="flex-1">
                    <Link to="/" className="font-bold dark:text-white text-4xl">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Tech
                        </span>
                        Blog
                    </Link>
                    <p className="text-sm mt-5">
                        Welcome to the Tech Blog. You can sign in with your email and
                        password or with Google.
                    </p>
                </div>
                {/* right */}

                <div className="flex-1">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmitHandler)}
                    >
                        <div>
                            <Label value="Your email" />
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                {...register("email")}
                            />
                            {errors.email && typeof errors.email.message === "string" && (
                                <span className="text-red-500 text-sm">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label value="Your password" />
                            <TextInput
                                type="password"
                                placeholder="**********"
                                {...register("password")}
                            />
                            {errors.password &&
                                typeof errors.password.message === "string" && (
                                    <span className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </span>
                                )}
                        </div>
                        <Button
                            gradientDuoTone="purpleToPink"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Loading...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Dont Have an account?</span>
                        <Link to="/sign-up" className="text-blue-500">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

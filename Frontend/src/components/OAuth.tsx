import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { PostQuery } from "../utils/ApiCall";
import { GOOGLE_SIGNIN } from "../utils/ApiRoutes";
import { useUserStore } from "../store/useUserStore";

export default function OAuth() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useUserStore();
    interface FormData {
        name: string;
        email: string;
        googlePhotoUrl: string;
    }

    const loginMutation = useMutation({
        mutationFn: async (val: FormData) => {
            try {
                await PostQuery<FormData>(GOOGLE_SIGNIN, val)
                    .then((res) => {
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        localStorage.setItem("token", JSON.stringify(res.data.at));

                        setAccessToken(res.data.at);
                        setUser(res.data.user);
                        navigate("/dashboard");
                    })
                    .catch((err) => console.log(err));
            } catch (error) {
                console.log(error);
            }
        },
    });

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);

            if (resultsFromGoogle) {
                const { displayName, email, photoURL } = resultsFromGoogle.user;

                loginMutation.mutate({
                    name: displayName || "Unknown User",
                    email: email || "",
                    googlePhotoUrl: photoURL || "",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form action="">
            <Button
                type="button"
                gradientDuoTone="pinkToOrange"
                outline
                onClick={handleGoogleClick}
                className="w-full mt-4"
            >
                <AiFillGoogleCircle className="w-6 h-6 mr-2" />
                Continue with Google
            </Button>
        </form>
    );
}

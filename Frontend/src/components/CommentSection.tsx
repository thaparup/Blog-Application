import { Alert, Button, Textarea } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FetchQuery, PatchQuery, PostQuery } from '../utils/ApiCall';
import { CREATE_COMMENT, GET_POST_COMMENTS, LIKE_UNLIKE_COMMENT } from '../utils/ApiRoutes';
import toast from 'react-hot-toast';
import Comment from './Comment';
// import Comment from './Comment';

type Comment = {
    content?: string;
    postId: string;
    userId: string;
    likes?: string[];
    numberOfLikes?: number;

};

export default function CommentSection({ postId }) {
    const { user } = useUserStore();
    const [commentError, setCommentError] = useState<string | null>(null);


    const FetchComments = async () => await FetchQuery(GET_POST_COMMENTS + `/${postId}`)

    const { data: comments } = useQuery(['comments', postId], FetchComments)

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Comment>();



    const content = watch('content', ''); // Watch the content field
    const queryClient = useQueryClient();


    // const updateLikeAsyncHandler = async (commentId: string) => PatchQuery(`${LIKE_UNLIKE_COMMENT}/${commentId}`, register)
    // const updateLike = useMutation({
    //     mutationFn: () => updateLikeAsyncHandler(commentId),
    //     onSuccess: () => {
    //         queryClient.setQueryData(['comments', commentId], (oldData: any) => {
    //             return oldData.data.map((comment: any) => {
    //                 if (comment._id === commentId) {
    //                     return {

    //                     }
    //                 }
    //             })
    //         })

    //     }
    // })
    // const handleLike = (commentId: string) => {

    //     if (!user) {
    //         navigate('/sign-in');
    //         return;
    //     }
    //   updateLike.mutate({})   
    // }


    const updateLikeAsyncHandler = async (commentId: string) => {
        // Send the commentId as a parameter to the server
        return PatchQuery(`${LIKE_UNLIKE_COMMENT}/${commentId}`, {});
    }

    const updateLike = useMutation({
        mutationFn: (commentId: string) => updateLikeAsyncHandler(commentId),
        onSuccess: () => {
            queryClient.setQueryData(['comments', commentId], (oldData: any) => {
                return oldData.data.map((comment: any) => {
                    if (comment._id === commentId) {
                        // You can update the comment data here if needed
                        // For example, toggle the like status or update the like count
                        return {
                            ...comment, // spread to preserve other comment properties
                            liked: !comment.liked, // toggle the 'liked' status
                        };
                    }
                    return comment;
                });
            });
        }
    });

    const handleLike = (commentId: string) => {
        if (!user) {
            navigate('/sign-in');
            return;
        }

        // Trigger the mutation with the commentId as the argument
        updateLike.mutate(commentId);
    }

    const createCommentMutation = useMutation({
        mutationFn: async (val: Comment) => {
            if (val.content!.length > 200) {
                return;
            }

            try {
                await PostQuery<Comment>(CREATE_COMMENT, { ...val, postId })
                    .then((res) => {
                        toast.success(res.message);
                        reset();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } catch (error) {
                console.error(error);
            }
        },
    });

    const onSubmit: SubmitHandler<Comment> = (data) => {
        if (data.content!.length > 200) {
            setCommentError('Comment cannot exceed 200 characters.');
            return;
        }

        setCommentError(null); // Clear error if valid
        createCommentMutation.mutate(data);
    };

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {user ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img
                        className='h-5 w-5 object-cover rounded-full'
                        src={user.profilePicture}
                        alt=''
                    />
                    <Link
                        to={'/dashboard?tab=profile'}
                        className='text-xs text-cyan-600 hover:underline'
                    >
                        @{user.username}
                    </Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                        Sign In
                    </Link>
                </div>
            )}

            {user && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='border border-teal-500 rounded-md p-3'
                >
                    <Textarea
                        placeholder='Add a comment...'
                        {...register('content', {
                            required: true,
                            maxLength: 200,
                        })}
                        value={content}
                    />


                    {errors.content && (
                        <Alert color='failure' className='mt-2'>
                            {errors.content.type === 'required'
                                ? 'Comment is required.'
                                : 'Comment exceeds maximum length of 200 characters.'}
                        </Alert>
                    )}

                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>
                            {200 - content.length} characters remaining
                        </p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>
                            Submit
                        </Button>
                    </div>
                </form>



            )}

            {comments?.data?.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments?.data?.length}</p>
                        </div>
                    </div>
                    {comments?.data?.map((comment: any) => (
                        <Comment key={comment._id} comment={comment} onLike={() => handleLike(comment._id)} />
                    ))}
                </>
            )}
        </div>
    );
}

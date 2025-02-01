import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FetchQuery } from '../utils/ApiCall';
import { FETCH_POST, GET_USERS } from '../utils/ApiRoutes';
import { useQuery } from 'react-query';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // const [recentPosts, setRecentPosts] = useState(null);

    console.log(postSlug)
    const FetchPost = async () => FetchQuery(FETCH_POST + `?slug=${postSlug}`)
    const { data: post, isLoading } = useQuery('post', FetchPost)
    const FetchRecentPost = async () => FetchQuery(FETCH_POST + `?limit=3`)
    const { data: recentPosts, } = useQuery('recentPost', FetchRecentPost)

    if (isLoading)
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );

    return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post?.data.posts[0].title}</h1>
        <Link to={`/search?category=${post && post?.data.posts[0].category}`} className='self-center mt-5'>
            <Button color='gray' pill size='xs'>{post && post?.data.posts[0].category}</Button>
        </Link>
        <img src={post && post?.data.posts[0].imageUrl} alt={post && post?.data.posts[0].title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>{post && new Date(post?.data.posts[0].createdAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post?.data.posts[0].content.length / 1000).toFixed(0)} mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>

        </div>
        <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
        </div>
        <CommentSection postId={post._id} />

        <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5'>Recent articles</h1>
            <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                {recentPosts &&
                    recentPosts.map((post: any) => <PostCard key={post._id} post={post} />)}
            </div>
        </div>
    </main>;
}
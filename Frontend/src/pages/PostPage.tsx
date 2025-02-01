import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FetchQuery } from '../utils/ApiCall';
import { FETCH_POST, GET_USERS } from '../utils/ApiRoutes';
import { useQuery } from 'react-query';
import CallToAction from '../components/CallToAction';

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    console.log(postSlug)
    const FetchPost = async () => FetchQuery(FETCH_POST + `?slug=${postSlug}`)
    const { data: post, isLoading } = useQuery('post', FetchPost)

    if (isLoading)
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );

    console.log(post?.data.posts[0])
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
    </main>;
}
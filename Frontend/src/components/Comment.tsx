import moment from 'moment';
import { useEffect, useState } from 'react';
import { FetchQuery } from '../utils/ApiCall';
import { GET_USER } from '../utils/ApiRoutes';
import { useQuery } from 'react-query';
import { FaThumbsUp } from 'react-icons/fa';
import { useUserStore } from '../store/useUserStore';

export default function Comment({ comment, onLike }) {


    const { user } = useUserStore();
    const FetchUser = async () => await FetchQuery(GET_USER + `${comment.userId}`)

    const { data: fetchedUser } = useQuery(['user', comment.userId], FetchUser)


    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img
                    className='w-10 h-10 rounded-full bg-gray-200'
                    src={fetchedUser?.data.profilePicture}
                    alt={fetchedUser?.data.username}
                />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {fetchedUser ? `@${fetchedUser?.data.username}` : 'anonymous user'}
                    </span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className='text-gray-500 pb-2'>{comment.content}</p>

                <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                    <button
                        type='button'
                        onClick={() => onLike(comment._id)}
                        className={`text-gray-400 hover:text-blue-500 ${user &&
                            comment.likes.includes(user?._id) &&
                            '!text-blue-500'
                            }`}
                    >
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <p className='text-gray-400'>
                        {comment.numberOfLikes > 0 &&
                            comment.numberOfLikes +
                            ' ' +
                            (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                    </p>
                </div>
            </div>
        </div>
    );
}
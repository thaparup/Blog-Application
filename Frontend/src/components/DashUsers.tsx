import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useUserStore } from '../store/useUserStore';
import { DeleteQuery, FetchQuery } from '../utils/ApiCall';
import { DELETE_USER, GET_USERS } from '../utils/ApiRoutes';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

export default function DashUsers() {
    const { user } = useUserStore()
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');


    const FetchPostHandler = async ({ pageParam = 0 }) => {
        const route = `${GET_USERS}?userId=${user?._id}&startIndex=${pageParam}&limit=9`;
        return await FetchQuery(route);
    };
    const queryClient = useQueryClient()
    const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
        ['users', user?._id],
        FetchPostHandler,
        {
            getNextPageParam: (lastPage, pages) => {

                const loadedUsers = pages.length * 9;
                return loadedUsers < lastPage.data.totalUsers ? loadedUsers : undefined;

            },

            staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
            cacheTime: 1000 * 60 * 10, // Data stays in cache for 10 minutes
            refetchOnWindowFocus: false, // Disable refetching on window focus
        }
    );


    const fetchedUsers = data?.pages.flatMap(page => page.data?.users) || [];



    const handleDeleteUser = async () => {
        setShowModal(false);

        DeleteQuery(DELETE_USER + `${userIdToDelete}`).then((res) => {
            queryClient.setQueryData(['users', user?._id], (oldData: any) => {
                if (!oldData) return oldData;
                toast.success('User deleted successfully!')

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        data: {
                            ...page.data,
                            posts: page.data.posts.filter((user: any) => user._id !== userIdToDelete)
                        }
                    }))
                };
            });


        }).catch((err) => console.log(err))


    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <Toaster position="top-right" />

            {user?.isAdmin && fetchedUsers.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {fetchedUsers?.map((user) => (
                            <Table.Body className='divide-y' key={user._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className='text-green-500' />
                                        ) : (
                                            <FaTimes className='text-red-500' />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no users yet!</p>
            )}
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
                            Are you sure you want to delete this user?
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
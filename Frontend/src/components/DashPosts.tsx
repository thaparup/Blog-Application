import { Table, Modal, Button } from "flowbite-react";
import { useUserStore } from "../store/useUserStore";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { DeleteQuery, FetchQuery } from "../utils/ApiCall";
import { DELETE_POST, FETCH_POST } from "../utils/ApiRoutes";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Post = {
  _id: string;
  userId: string;
  content: string;
  title: string;
  category: string;
  imageUrl: string;
  slug: string;
  updatedAt: string;
};

type Pages = {
  data: Post[];
  message: string;
  statusCode: string;
  success: boolean;
}
type PaginatedPostsResponse = {
  statusCode: number;
  message: string;
  data: {
    posts: Post[];
    totalPosts: number;
    lastMonthPosts: number;
  };
  success: boolean;
};


export default function DashPosts() {
  const { user } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const FetchPostHandler = async ({ pageParam = 0 }): Promise<PaginatedPostsResponse> => {
    const route = `${FETCH_POST}?userId=${user?._id}&startIndex=${pageParam}&limit=9`;
    return await FetchQuery(route);
  };
  const queryClient = useQueryClient()
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
    ['posts', user?._id],
    FetchPostHandler,
    {
      getNextPageParam: (lastPage: PaginatedPostsResponse, pages) => {

        const loadedPosts = pages.length * 9;
        return loadedPosts < lastPage.data.totalPosts ? loadedPosts : undefined;

      },

      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Data stays in cache for 10 minutes
      refetchOnWindowFocus: false, // Disable refetching on window focus
    }
  );

  const posts = data?.pages.flatMap(page => page.data?.posts) || [];
  const handleDeletePost = async () => {
    setShowModal(false);

    DeleteQuery(DELETE_POST + `${postIdToDelete}/${user?._id}`).then((res) => {
      queryClient.setQueryData(['posts', user?._id], (oldData: any) => {
        if (!oldData) return oldData;
        console.log('older data', oldData)
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.filter((post: Post) => post._id !== postIdToDelete)
            }
          }))
        };
      });

      toast.success('Post deleted successfully!')

    }).catch((err) => console.log(err))


  };


  const handleDelete = (id: string) => {
    setShowModal(true);

    setPostIdToDelete(id)


  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Toaster position="top-right" />
      {user?.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts.map((post, index) => (
                <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell onClick={() => handleDelete(post._id)}>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              {isFetchingNextPage ? "Loading more..." : "Show more"}
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
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
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
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

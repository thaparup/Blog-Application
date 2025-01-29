import axios from "axios";

export const FetchQuery = async (route: string) => {
  return await axios
    .get(route, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

export const PostQuery = async <T, R = any>(
  route: string,
  val?: T
): Promise<R> => {
  return await axios
    .post(route, val, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
export const PatchQuery = async <T, R = any>(
  route: string,
  val: T
): Promise<R> => {
  return await axios
    .patch(route, val, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const DeleteQuery = async <R = any>(route: string): Promise<R> => {
  try {
    const response = await axios.delete(route);
    return response.data;
  } catch (err) {
    console.error(`Error occurred during DELETE request to ${route}:`, err);
    throw new Error(`Failed to delete resource at ${route}`);
  }
};

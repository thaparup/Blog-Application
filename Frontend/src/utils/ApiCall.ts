import axios from "axios";

export const FetchQuery = async (route: string) => {
  return await axios
    .get(route, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

export const PostQuery = async <T, R = any>(
  route: string,
  val: T
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

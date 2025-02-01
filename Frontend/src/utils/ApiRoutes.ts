export const TRY = `/api/v1/user/try`;

//Post Routes
export const CREATE_POST = "/api/v1/post/create";
export const FETCH_POST = `/api/v1/post/getposts`;
export const DELETE_POST = `/api/v1/post/deletepost/`;
export const UPDATE_POST = `/api/v1/post/updatepost/`;

// User And Auth Routes
export const REGISTER = `/api/v1/user/register`;
export const SIGNIN = `/api/v1/auth/signin`;
export const GOOGLE_SIGNIN = `/api/v1/auth/google/signin`;
export const UPDATE_USER_PROFILE = `/api/v1/user/update/`;
export const DELETE_USER = `/api/v1/user/delete/`;
export const LOGOUT = `/api/v1/user/logout`;
export const GET_USERS = `/api/v1/user/getusers`;
export const GET_USER = `/api/v1/user/:userId/`;

// Comment Routes

export const CREATE_COMMENT = `/api/v1/comment/create`;
export const GET_POST_COMMENTS = `/api/v1/comment/getcomments/`;
export const LIKE_UNLIKE_COMMENT = `/api/v1/comment/likecomment/`;
export const GET_COMMENTS = `/api/v1/comment/getcomments`;

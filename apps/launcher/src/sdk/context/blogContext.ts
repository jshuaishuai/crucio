import React, { createContext } from "react";

type IBlogContext = {
  userBlog: boolean;
  setUserBlog: (c: any) => void;
};

const UserBlogContext = createContext<IBlogContext>({
  userBlog: false,
  setUserBlog: () => {},
});
export default UserBlogContext;

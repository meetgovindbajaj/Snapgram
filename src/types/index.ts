import { Models } from "appwrite";
import React from "react";

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type IUserLogin = {
  email: string;
  password: string;
};

export type INewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type INewUserSave = {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
};

export type IFileUploader = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
};

export type IPostForm = {
  post?: Models.Document;
  action: "create" | "update";
};

export type IPostCard = {
  post?: Models.Document;
};

export type IPostStats = {
  userId: string;
  post?: Models.Document;
};

export type IGridPostList = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

export type ISearchResult = {
  searchedPosts?: Models.Document[];
  isSearching: boolean;
};

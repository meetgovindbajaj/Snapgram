import {
  INewPost,
  INewUser,
  INewUserSave,
  IUpdatePost,
  IUpdateUser,
  IUserLogin,
} from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

// creates the new user account
export async function createUserAccount(user: INewUser) {
  try {
    // creating new user account
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("Failed to signup");

    // creates the user avatar image with user's name
    const avatarUrl = avatars.getInitials(user.name);
    const userDetails = {
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    };

    // saves the user to database
    const newUser = await saveUserToDB(userDetails);
    return newUser;
  } catch (error) {
    //console.log(error);
    return error;
  }
}

// saves the user account in database
export async function saveUserToDB(user: INewUserSave) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    //console.log(error);
  }
}

// creates the session token for the user
export async function signInAccount(user: IUserLogin) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    //console.log(error);
    return error;
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// returns the user details if user has session token present in local storage
export async function getCurrentUser() {
  try {
    // trying to get user details from token present
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("Session expired");

    // cross checking if logged in user is present in database
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw new Error("User not found");

    return currentUser.documents[0];
  } catch (error) {
    console.log("Session expired");
  }
}

// logout the user
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    //console.log(error);
    return error;
  }
}

export async function createPost(post: INewPost) {
  try {
    // uploading image to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error("File not uploaded");
    // creating image url from uploaded image id
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      // deleting the image if something goes wrong
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to create file url");
    }
    // converting tags string into an array
    let tags = post.tags?.replace(/ /g, "").trim().split(",") ?? [];
    if (tags.length > 0 && tags[0] === "") tags = [];
    // saving new post to database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        location: post.location,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        tags,
      }
    );
    if (!newPost) {
      // deleting the image if something goes wrong
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to create new post");
    }
    return newPost;
  } catch (error) {
    //console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    //console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    //console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    //console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw new Error("Some error occured while fetching posts");
    return posts;
  } catch (error) {
    //console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw new Error("Some error occured - like post");
    return updatedPost;
  } catch (error) {
    //console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const savePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!savePost) throw new Error("Some error occured - save post");
    return savePost;
  } catch (error) {
    //console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw new Error("Some error occured - delete saved post");
    return { status: "ok" };
  } catch (error) {
    //console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    // console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  // checking if image is changed
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post?.imageUrl,
      imageId: post?.imageId,
    };
    if (hasFileToUpdate) {
      // uploading image to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("File not uploaded");
      // creating image url from uploaded image id
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        // deleting the image if something goes wrong
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to create file url");
      }
      image = { ...image, imageId: uploadedFile.$id, imageUrl: fileUrl };
    }
    // converting tags string into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    // updating the post in database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post?.postId,
      {
        caption: post.caption,
        location: post.location,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        tags,
      }
    );
    if (!updatedPost) {
      // deleting the image if something goes wrong
      await deleteFile(image.imageId);
      throw new Error("Failed to update the post");
    }
    if (hasFileToUpdate)
      // deleting the previous image file
      await deleteFile(post?.imageId);
    return updatedPost;
  } catch (error) {
    //console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  try {
    if (!postId || !imageId) throw new Error("Missing parameters");
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    await deleteFile(imageId);
    return { status: "ok" };
  } catch (error) {
    //console.log(error);
  }
}

export async function getInfinitePosts({
  pageParam,
}: {
  pageParam: number | undefined;
}) {
  const queries: string[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  if (pageParam) queries.push(Query.cursorAfter(pageParam.toString()));
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    if (!posts) throw new Error("Some error occured");
    return posts;
  } catch (error) {
    // console.log(error)
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw new Error("Some error occured");
    return posts;
  } catch (error) {
    // console.log(error)
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers(limit?: number) {
  const queries: string[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

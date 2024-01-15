import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/reactQuery/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { IPostStats } from "@/types";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const PostStats = ({ post, userId }: IPostStats) => {
  const { data: currentUser } = useGetCurrentUser();
  const likesList: string[] | [] = post?.likes?.map(
    (user: Models.Document) => user?.$id
  );
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );
  const [likes, setLikes] = useState<string[] | []>(likesList);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } =
    useDeleteSavedPost();

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) newLikes = newLikes.filter((id) => id !== userId);
    else newLikes.push(userId);
    setLikes(newLikes);
    likePost({ postId: post?.$id as string, likesArray: newLikes });
  };
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      setIsSaved(true);
      savePost({ postId: post?.$id as string, userId });
    }
  };
  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId) ? "/icons/liked.svg" : "/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-meduim">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSavedPost ? (
          <Loader />
        ) : (
          <img
            src={`/icons/${isSaved ? "saved" : "save"}.svg`}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;

import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import useUserContext from "@/context";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/reactQuery/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: post, isPending } = useGetPostById(id as string);
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();
  const handleDeletePost = () => {
    deletePost({
      postId: post?.$id as string,
      imageId: post?.imageId,
    });
    navigate("/");
  };
  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={`${post?.imageUrl}` || "/icons/profile-placeholder.svg"}
            alt="post_image"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl || "/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator?.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center ">
                <Link
                  to={`/updatepost/${post?.$id}`}
                  className={`${user?.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  disabled={isDeletingPost}
                  variant={"ghost"}
                  className={`"ghost_details-delete_btn" ${
                    user?.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  {isDeletingPost ? (
                    <Loader />
                  ) : (
                    <img
                      src="/icons/delete.svg"
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  )}
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-1 flex-col w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: number) => (
                  <li
                    key={`PostDetails_${post?.$id}_tag_${index}_${tag}`}
                    className="text-light-3"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats
                key={`PostDetails_${post?.$id}_postStats`}
                post={post}
                userId={user.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;

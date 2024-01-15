import useUserContext from "@/context";
import { multiFormatDateString } from "@/lib/utils";
import { IPostCard } from "@/types";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

const PostCard = ({ post }: IPostCard) => {
  const { user } = useUserContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.creator.$id}`}>
            <img
              src={post?.creator?.imageUrl || "/icons/profile-placeholder.svg"}
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
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
        </div>
        <Link
          to={`/updatepost/${post?.$id}`}
          className={`${user?.id !== post?.creator.$id && "hidden"}`}
        >
          <img src="/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post?.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post?.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags.map((tag: string, index: number) => (
              <li
                key={`${post?.$id}_tag_${index}_${tag}`}
                className="text-light-3"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          key={post?.imageId}
          src={post?.imageUrl || "/icons/profile-placeholder.svg"}
          alt={`image_${post?.caption}`}
          className="post-card_img"
        />
      </Link>
      <PostStats key={`${post?.$id}_postStats`} post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;

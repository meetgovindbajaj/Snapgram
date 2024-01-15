import useUserContext from "@/context";
import { IGridPostList } from "@/types";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: IGridPostList) => {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts?.map((post, index) => (
        <li
          key={`grid_posts-${post.$id}-${index}`}
          className="relative min-w-80 h-80"
        >
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl || "/icons/profile-placeholder.svg"}
              alt="explore-post"
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post.creator.imageUrl}
                  alt="creator"
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;

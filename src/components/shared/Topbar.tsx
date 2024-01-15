import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/reactQuery/queriesAndMutations";
import { useEffect } from "react";
import useUserContext from "@/context";
import { INITIAL_USER } from "@/constants";
import { useToast } from "../ui/use-toast";

const Topbar = () => {
  const { toast } = useToast();
  const { setIsAuthenticated, setUser, user } = useUserContext();
  const { mutate: signOutAccount, isSuccess } = useSignOutAccount();
  useEffect(() => {
    if (isSuccess) {
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      toast({ title: "Logged out" });
    }
  }, [isSuccess, setIsAuthenticated, setUser, toast]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to={"/"} className="flex gap-3 items-center">
          <img src="/images/logo.svg" alt="logo" width={130} height={325} />
        </Link>
        <div className="flex gap-4">
          <Button
            className="shad-button_ghost"
            variant={"ghost"}
            onClick={() => {
              toast({ title: "Logging out..." });
              signOutAccount();
            }}
          >
            <img src="/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={`${user.imageUrl}` || "/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;

import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/reactQuery/queriesAndMutations";
import { useEffect } from "react";
import useUserContext from "@/context";
import { INITIAL_USER, sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { useToast } from "../ui/use-toast";

const LeftSidebar = () => {
  const { toast } = useToast();
  const { setIsAuthenticated, setUser, user } = useUserContext();
  const { mutate: signOutAccount, isSuccess } = useSignOutAccount();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isSuccess) {
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      toast({ title: "Logged out" });
    }
  }, [isSuccess, setIsAuthenticated, setUser, toast]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to={"/"} className="flex gap-3 items-center">
          <img src="/images/logo.svg" alt="logo" width={170} height={36} />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={`${user.imageUrl}` || "/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink, index: number) => (
            <li
              key={index + "-left-" + link.label}
              className={`leftsidebar-link group ${
                pathname === link.route && "bg-primary-500"
              }`}
            >
              <NavLink
                to={link.route}
                className={"flex gap-4 items-center p-4"}
              >
                <img
                  src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white ${
                    pathname === link.route && "invert-white"
                  }`}
                />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Button
        className="shad-button_ghost"
        variant={"ghost"}
        onClick={() => {
          toast({ title: "Logging out..." });
          signOutAccount();
        }}
      >
        <img src="/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;

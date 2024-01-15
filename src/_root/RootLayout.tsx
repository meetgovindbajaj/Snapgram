import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import useUserContext from "@/context";
import { Navigate, Outlet } from "react-router-dom";

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();
  return isAuthenticated ? (
    <>
      <div className="w-full md:flex">
        <Topbar />
        <LeftSidebar />
        <section className="flex flex-1 h-full">
          <Outlet />
        </section>
        <Bottombar />
      </div>
    </>
  ) : (
    <Navigate to={"/signin"} />
  );
};

export default RootLayout;

import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { fetchMyParlor } from "@/store/admin/parlor-slice";
import PropTypes from "prop-types";
import { useEffect } from "react";

function ParlorOwnerHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myParlor } = useSelector((state) => state.adminParlors);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyParlor());
    }
  }, [dispatch, user?.id]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-col">
          {myParlor && (
            <h1 className="text-xl font-bold text-gray-900">{myParlor.name}</h1>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

ParlorOwnerHeader.propTypes = {
  setOpen: PropTypes.func,
};

export default ParlorOwnerHeader;

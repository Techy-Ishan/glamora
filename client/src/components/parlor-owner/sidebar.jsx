import { Calendar, Settings, ImageIcon, Building2 } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const parlorOwnerSidebarMenuItems = [
  {
    id: "appointments",
    label: "Appointments",
    path: "/parlor-owner/dashboard",
    icon: <Calendar />,
  },
  {
    id: "services",
    label: "Services",
    path: "/parlor-owner/services",
    icon: <Settings />,
  },
  {
    id: "photo-gallery",
    label: "Photo Gallery",
    path: "/parlor-owner/parlor-info",
    icon: <ImageIcon />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2 flex-1">
      <div className="flex-1">
        {parlorOwnerSidebarMenuItems.map((menuItem) => (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

MenuItems.propTypes = {
  setOpen: PropTypes.func,
};

function ParlorOwnerSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <Building2 size={30} />
                <h1 className="text-2xl font-extrabold">Parlor Owner</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/parlor-owner/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <Building2 size={30} />
          <h1 className="text-2xl font-extrabold">Parlor Owner</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

ParlorOwnerSideBar.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default ParlorOwnerSideBar;

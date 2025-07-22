import { Outlet } from "react-router-dom";
import ParlorOwnerSideBar from "./sidebar";
import ParlorOwnerHeader from "./header";
import { useState } from "react";

function ParlorOwnerLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* parlor owner sidebar */}
      <ParlorOwnerSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* parlor owner header */}
        <ParlorOwnerHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ParlorOwnerLayout;

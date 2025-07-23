import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import NotificationBanner from "@/components/common/notification-banner";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-white">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      {/* Notification Banner */}
      <NotificationBanner />
    </div>
  );
}

export default ShoppingLayout;

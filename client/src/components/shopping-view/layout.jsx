import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-white">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;

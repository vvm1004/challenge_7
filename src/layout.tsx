import { Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <div>
      <Outlet context={[searchTerm, setSearchTerm]} />
    </div>
  );
}

export default Layout;

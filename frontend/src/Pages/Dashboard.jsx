import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const Dashboard = () => {
  return (
    <div className="h-full w-full bg-stone-100 flex flex-col md:flex-row overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 min-h-0 flex flex-col p-2 sm:p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

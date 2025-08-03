import { Outlet } from 'react-router-dom';
import Header from './Header';
import MiscSidebar from './MiscSidebar';
import ProtectedRoute from './ProtectedRoute';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col-reverse md:grid md:grid-cols-[auto_1fr] xl:grid-cols-[auto_1fr_25rem] bg-[var(--color-grey-50)]/40 backdrop-blur-md h-screen">
        <aside className="">
          <Sidebar />
        </aside>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <div className="block md:hidden">
          <Header />
        </div>
        <div className="hidden xl:block">
          <MiscSidebar />
        </div>
      </div>
    </ProtectedRoute>
  );
}

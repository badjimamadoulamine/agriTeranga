import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'

const AdminLayout = ({ children, title, showSearch = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader title={title} showSearch={showSearch} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
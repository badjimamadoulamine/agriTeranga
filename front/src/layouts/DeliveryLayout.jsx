import DeliverySidebar from '../components/delivery/DeliverySidebar';
import DeliveryHeader from '../components/delivery/DeliveryHeader';

const DeliveryLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <DeliverySidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DeliveryHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
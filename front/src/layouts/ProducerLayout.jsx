import ProducerSidebar from '../components/producer/ProducerSidebar';
import ProducerHeader from '../components/producer/ProducerHeader';

const ProducerLayout = ({ children, pageTitle, pageSubtitle }) => {
  return (
    <div className="flex h-screen bg-[#F8FAF8]">
      {/* Sidebar */}
      <ProducerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ProducerHeader title={pageTitle} subtitle={pageSubtitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProducerLayout;
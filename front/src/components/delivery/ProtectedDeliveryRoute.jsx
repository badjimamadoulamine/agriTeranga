import { Navigate } from 'react-router-dom';

const ProtectedDeliveryRoute = ({ children }) => {
  const deliveryToken = localStorage.getItem('deliveryDashboardToken');
  if (!deliveryToken) {
    return <Navigate to="/delivery/login" replace />;
  }
  return children;
};

export default ProtectedDeliveryRoute;

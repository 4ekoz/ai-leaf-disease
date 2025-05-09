import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // التحقق من وجود توكن تسجيل الدخول في localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;

  // إذا كان المستخدم مسجل دخوله، اعرض المحتوى المطلوب
  // وإلا قم بتوجيهه إلى صفحة تسجيل الدخول
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
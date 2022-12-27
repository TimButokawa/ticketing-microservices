import React from 'react';
import { useRouter } from 'next/router';

const Protected = ({ children, currentUser}) => {
  const router = useRouter();
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up'];
  const isAuthorized = React.useMemo(() => !!currentUser, [currentUser]);

  if (typeof window !== undefined && !isAuthorized && !publicRoutes.includes(router.route)) {
    router.push('/auth/sign-in');
  }

  if (isAuthorized || publicRoutes.includes(router.route)) {
    return children;
  }

};

export default Protected;

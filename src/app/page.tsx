'use client';

import { useAppStore } from '@/lib/store';
import LandingPage from '@/components/shared/LandingPage';
import RoleSelector from '@/components/shared/RoleSelector';
import IndividualPortal from '@/components/individual/IndividualPortal';
import EmployerPortal from '@/components/employer/EmployerPortal';
import InsurancePortal from '@/components/insurance/InsurancePortal';

export default function Home() {
  const { isAuthenticated, userRole } = useAppStore();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (!userRole) {
    return <RoleSelector />;
  }

  switch (userRole) {
    case 'individual':
      return <IndividualPortal />;
    case 'employer':
      return <EmployerPortal />;
    case 'insurance':
      return <InsurancePortal />;
    default:
      return <RoleSelector />;
  }
}

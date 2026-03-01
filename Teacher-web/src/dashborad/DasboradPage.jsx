import React from 'react';
import Hero from './Hero';
import RecentSession from './RecentSession';
import { useSession } from "../SessionContext";
function DashboardPage() {
  const { activeSession } = useSession();
  console.log("Dashboard sees:", activeSession);

  return (
    <div className="px-25">
      <Hero />
      <RecentSession />
    </div>
  );
}



export default DashboardPage;

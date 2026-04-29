import { Outlet } from 'react-router-dom';
import PublicNav from './PublicNav';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <PublicNav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

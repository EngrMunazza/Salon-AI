import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router keeps scroll position on navigation by default;
// Next.js used to reset it for us. This restores that behavior.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

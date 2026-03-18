import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This tells the browser to jump to the top of the window
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

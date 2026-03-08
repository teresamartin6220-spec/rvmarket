import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getVisitorId(): string {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const visitorId = getVisitorId();
    supabase.from("page_views").insert({
      page: location.pathname,
      visitor_id: visitorId,
      user_agent: navigator.userAgent,
    }).then(() => {});
  }, [location.pathname]);
}

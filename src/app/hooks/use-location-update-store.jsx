import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function useLocationUpdateStore() {
  const location = useLocation();
  useEffect(() => {
    // todo, move routing store and state updates here
  }, [location]);
}

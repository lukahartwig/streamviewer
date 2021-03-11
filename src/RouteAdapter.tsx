import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const RouteAdapter: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedHistory = useMemo(
    () => ({
      // @ts-ignore
      replace(location) {
        navigate(location, { replace: true, state: location.state });
      },
      //@ts-ignore
      push(location) {
        navigate(location, { replace: false, state: location.state });
      },
    }),
    [navigate]
  );

  // @ts-ignore
  return children({ history: adaptedHistory, location });
};

import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "react-query";
import { Navigate, Outlet } from "react-router-dom";
import { getUsername, verifyToken } from "../api/userApi";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoutes() {
  const { setIsAuth, isAuth, username, setUsername } = useAuth();

  const {
    data,
    refetch,
    isFetching: isFetchingUsername,
  } = useQuery("getUsername", getUsername, {
    onSuccess: ({ data }) => {
      setUsername(data?.username);
    },
    onError: (error) => {
      console.log(error);
    },
    enabled: false,
  });

  const { isFetching, isLoading } = useQuery("verifyToken", verifyToken, {
    onSuccess: ({ data }) => {
      if (data.isTokenValid) {
        setIsAuth(true);
        if (username === undefined) {
          refetch();
        }
      } else {
        setIsAuth(false);
      }
    },
    onError: (error) => {
      console.log(error);
    },
    cacheTime: 0,
    staleTime: 0,
  });

  if (isFetching || isLoading || isFetchingUsername)
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );

  return isAuth === true ? <Outlet /> : <Navigate to="/login" replace={true} />;
}

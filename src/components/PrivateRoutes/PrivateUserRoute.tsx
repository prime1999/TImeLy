import { useUserAuthStatus } from "@/hooks/useAuthStatus";
import FullPageLoader from "@/lib/utils/FullPageLoader";
import { Navigate, Outlet } from "react-router-dom";

const PrivateUserRoutes = () => {
	console.log(123);
	const { isLoggedIn, checkingStatus } = useUserAuthStatus();

	if (checkingStatus) {
		return <FullPageLoader />;
	}
	return isLoggedIn ? <Outlet /> : <Navigate to="/signIn" />;
};

export default PrivateUserRoutes;

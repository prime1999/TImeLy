import { checkCurrentSession } from "@/lib/actions/Student.actions";
import { useState, useEffect } from "react";

export const useUserAuthStatus = () => {
	const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		const handleLoad = async () => {
			const student = await checkCurrentSession();
			if (student && student.$id) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
			setCheckingStatus(false);
		};

		handleLoad();
	}, []);
	return { isLoggedIn, checkingStatus };
};

// export const useAdminAuthStatus = () => {
// 	const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
// 	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

// 	const { userInfo } = useSelector((state: any) => state.auth);

// 	useEffect(() => {
// 		if (userInfo && userInfo.isAdmin) {
// 			setIsLoggedIn(true);
// 		} else {
// 			setIsLoggedIn(false);
// 		}
// 		setCheckingStatus(false);
// 	}, [userInfo]);
// 	return { isLoggedIn, checkingStatus };
// };

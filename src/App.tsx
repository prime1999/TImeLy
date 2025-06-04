import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { store } from "./lib/store";
import { Provider } from "react-redux";
import RootLayout from "./Layouts/RootLayout";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Register from "./Pages/Register";
function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" element={<RootLayout />}>
					<Route index={true} path="/" element={<SignUp />} />
					<Route path="/signIn" element={<SignIn />} />
					<Route path="/students/:userId/register" element={<Register />} />
					{/* <Route path="/order" element={<PrivateUserRoutes />}>
						<Route path="/order" element={<OrderPage />} />
					</Route> */}
				</Route>
			</>
		)
	);
	return (
		<>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</>
	);
}

export default App;

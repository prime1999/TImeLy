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
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";
import { ThemeProvider } from "./components/theme-provider";
import Courses from "./Pages/Courses";
import PrivateUserRoutes from "./components/PrivateRoutes/PrivateUserRoute";
function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" element={<RootLayout />}>
					<Route index={true} path="/" element={<HomePage />} />
					<Route path="/courses" element={<PrivateUserRoutes />}>
						<Route path="/courses" element={<Courses />} />
					</Route>
					<Route path="/dashboard" element={<PrivateUserRoutes />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
				</Route>
				<Route path="/register" element={<SignUp />} />
				<Route path="/signIn" element={<SignIn />} />
				<Route path="/register/student/:userId" element={<Register />} />
			</>
		)
	);
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<Provider store={store}>
					<RouterProvider router={router} />
				</Provider>
			</ThemeProvider>
		</>
	);
}

export default App;

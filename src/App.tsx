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
function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" element={<RootLayout />}>
					<Route index={true} path="/" element={<HomePage />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/signIn" element={<SignIn />} />
					<Route path="/register/student/:userId" element={<Register />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/courses" element={<Courses />} />
					{/* <Route path="/order" element={<PrivateUserRoutes />}>
						<Route path="/order" element={<OrderPage />} />
					</Route> */}
				</Route>
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

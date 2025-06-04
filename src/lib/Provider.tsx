// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store"; // adjust the path to your Redux store

export function Providers({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}

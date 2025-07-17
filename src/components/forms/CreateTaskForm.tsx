import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { createTaskSchema } from "@/lib/Validation";

const CreateTaskForm = () => {
	const form = useForm<z.infer<typeof createTaskSchema>>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: "",
			body: "",
			status: "",
			startDate: "",
			endDate: "",
		},
	});

	const onSubmit = async () => {};
	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 w-full mx-auto"
				></form>
			</Form>
		</div>
	);
};

export default CreateTaskForm;

import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

type Props = {
	body: string;
	setBody: any;
};

const TaskBody = ({ body, setBody }: Props) => {
	return (
		<main className="container mx-auto">
			<h6 className="font-inter font-semibold mb-2">Body</h6>
			<MDEditor
				style={{ height: "900px" }}
				value={body}
				onChange={(val: any) => setBody(val)}
			/>
		</main>
	);
};

export default TaskBody;

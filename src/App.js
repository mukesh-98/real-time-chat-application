import React from "react";

import ToggleMode from "./component/ToggleMode";
import Main from "./component/Main";

function App() {
	return (
		<ToggleMode>
			<Main />
		</ToggleMode>
	);
}

export default App;

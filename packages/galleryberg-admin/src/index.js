import { render } from "@wordpress/element";
import AdminMenuContainer from "./containers/AdminMenuContainer";
import AdminMenuWrapper from "./components/AdminMenuWrapper";

import "./css/src/galleryberg-admin-settings.scss";

const mountPoint = document.querySelector("#galleryberg-admin-menu");

if (mountPoint) {
	render(
		<AdminMenuWrapper>
			<AdminMenuContainer />
		</AdminMenuWrapper>,
		mountPoint
	);
}

import React from "react";
import MenuHeader from "../components/MenuHeader";
import Content from "../components/Content";
import { useState } from "react";

/**
 * Container for admin menu.
 *
 * @return {JSX.Element} container component
 * @function Object() { [native code] }
 */
function AdminMenuContainer() {
    const url = new URL(window.location.href);
    const route = url.searchParams.get("route");

    const [currentRoutePath, setCurrentRoutePath] = useState(
        route ?? "welcome",
    );
    
    return (
        <div className={"galleryberg-admin-menu-container"}>
            <MenuHeader
                currentRoutePath={currentRoutePath}
                setCurrentRoutePath={setCurrentRoutePath}
            />
            <Content
                currentRoutePath={currentRoutePath}
                setCurrentRoutePath={setCurrentRoutePath}
            />
        </div>
    );
}

/**
 * @module AdminMenuContainer
 */
export default AdminMenuContainer;

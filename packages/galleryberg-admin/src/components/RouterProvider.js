import React, { useMemo } from "react";
import Router from "./Router";
import routes from "../inc/routes";
import { generateRouteArray } from "../inc/Route";

/**
 * RouterProvider component.
 *
 * @param {Object}   props                  component properties
 * @param {Router}   props.children         router component
 * @class
 */
function RouterProvider({ children, currentRoutePath, setCurrentRoutePath }) {
    const routeObjects = useMemo(() => generateRouteArray(routes), []);

    return (
        <Router routes={routeObjects} currentRoutePath={currentRoutePath} />
    );
}

/**
 * @module RouterProvider
 */
export default RouterProvider;

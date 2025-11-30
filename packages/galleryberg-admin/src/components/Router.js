import React, { useEffect, useState } from "react";
import Route from "../inc/Route";

/**
 * Router for different menu content.
 *
 * Router children components should be Route components. Else those who are not will be ignored.
 *
 * If no route matches, the last route will be shown. It can be used as 404 page.
 *
 * @param {Object}       props                  component properties
 * @param {Array<Route>} props.routes           routes array
 * @param {string}       props.currentRoutePath current route path
 */
function Router({ routes, currentRoutePath }) {
    const [currentElement, setCurrentElement] = useState(null);

    useEffect(() => {
        let foundRoute = null;

        for (const route of routes) {
            if (route.getPath() === currentRoutePath) {
                foundRoute = route;
                break;
            }
        }

        if (!foundRoute && routes.length > 0) {
            foundRoute = routes[routes.length - 1];
        }

        if (foundRoute) {
            setCurrentElement(foundRoute.getElement());
        }
    }, [currentRoutePath, routes]);

    return <div className={"galleryberg-router-content"}>{currentElement}</div>;
}

/**
 * @module Router
 */
export default Router;

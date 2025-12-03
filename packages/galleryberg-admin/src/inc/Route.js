import React from "react";

/**
 * Route default options.
 *
 * @type {Object}
 */
export const defaultRouteOptions = {
    path: null,
    title: "no_title",
    element: null,
};

/**
 * Route object.
 *
 * @param {Object} options route options
 * @class
 */
function Route(options) {
    this.options = { ...defaultRouteOptions, ...options };

    this.getPath = () => this.options.path;
    this.getTitle = () => this.options.title;
    this.getElement = () => this.options.element;
}

/**
 * Generate options array from settings objects.
 *
 * These settings objects should correspond to Route default options.
 *
 * @param {Array<Object>} optionsArray options array
 * @return {Array<Route>} route object array
 */
export const generateRouteArray = (optionsArray) => {
    return optionsArray.map((options) => new Route(options));
};

/**
 * @module Route
 */
export default Route;

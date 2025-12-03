import React from "react";

/**
 * Navigation header button component.
 *
 * @param {Object}   props            component properties
 * @param {string}   props.title      button title
 * @param {string}   props.targetPath target route path
 * @param {boolean}  props.isActive   active status
 * @param {Function} props.setRoute   set route function
 * @class
 */
function NavigationHeaderButton({ title, targetPath, isActive, setRoute }) {
    return (
        <button
            className={"galleryberg-menu-navigation-header-button"}
            data-active={isActive}
            onClick={() => setRoute(targetPath)}
        >
            {title}
        </button>
    );
}

/**
 * @module NavigationHeaderButton
 */
export default NavigationHeaderButton;

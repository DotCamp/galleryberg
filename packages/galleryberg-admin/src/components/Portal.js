import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Portal component for rendering children in a different DOM node.
 *
 * @param {Object} props          component properties
 * @param {Node}   props.target   target DOM node
 * @param {Node}   props.children children to render
 * @class
 */
function Portal({ target, children }) {
	const containerRef = useRef(null);

	if (!containerRef.current) {
		containerRef.current = document.createElement("div");
	}

	useEffect(() => {
		const container = containerRef.current;
		target.appendChild(container);

		return () => {
			target.removeChild(container);
		};
	}, [target]);

	return createPortal(children, containerRef.current);
}

/**
 * @module Portal
 */
export default Portal;

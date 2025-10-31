window.addEventListener("DOMContentLoaded", () => {
	if (typeof GLightbox !== "function") return;
	const galleries = document.querySelectorAll(
		".galleryberg-gallery-container.galleryberg-has-lightbox",
	);
	galleries.forEach((gallery) => {
		const images = gallery.querySelectorAll("img");
		const slides = Array.from(images).map((img) => ({
			href: img.src,
			type: "image",
			description: img.alt || "",
			title: img.title || "",
		}));

		// Read effect options from data attributes
		const openEffect = gallery.getAttribute("data-open-effect") || "zoom";
		const closeEffect = gallery.getAttribute("data-close-effect") || "zoom";
		const slideEffect = gallery.getAttribute("data-slide-effect") || "slide";
		const keyboardNavigation =
			gallery.getAttribute("data-keyboard-navigation") !== "false";
		const loop = gallery.getAttribute("data-loop") !== "false";
		const zoomable = gallery.getAttribute("data-zoomable") !== "false";
		const draggable = gallery.getAttribute("data-draggable") !== "false";

		const lightbox = GLightbox({
			elements: slides,
			keyboardNavigation,
			loop,
			zoomable,
			draggable,
			openEffect,
			closeEffect,
			slideEffect,
		});
		images.forEach((img, idx) => {
			img.style.cursor = "pointer";
			img.addEventListener("click", (e) => {
				e.preventDefault();
				lightbox.openAt(idx);
			});
		});
	});
});

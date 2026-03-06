window.addEventListener("DOMContentLoaded", () => {
	if (typeof GLightbox !== "function") return;

	// Store lightbox instances globally for Pro plugin access
	window.gallerybergLightboxes = window.gallerybergLightboxes || new Map();

	const galleries = document.querySelectorAll(
		".galleryberg-gallery-container.galleryberg-has-lightbox",
	);
	galleries.forEach((gallery) => {
		const images = gallery.querySelectorAll("img");
		const showLightboxCaptions =
			gallery.getAttribute("data-show-lightbox-captions") === "true";

		const slides = Array.from(images).map((img) => {
			const figure = img.closest("figure");
			const figcaption = figure ? figure.querySelector("figcaption") : null;
			const description =
				showLightboxCaptions && figcaption ? figcaption.innerHTML : "";
			const href = img.getAttribute("data-src") || img.currentSrc || img.src;

			return {
				href,
				type: "image",
				title: img.title || "",
				description: description,
			};
		});

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

		// Store instance for Pro plugin access
		const lightboxId = `lightbox-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		gallery.dataset.lightboxId = lightboxId;
		window.gallerybergLightboxes.set(lightboxId, lightbox);

		images.forEach((img, idx) => {
			img.style.cursor = "pointer";
			img.addEventListener("click", (e) => {
				e.preventDefault();
				lightbox.openAt(idx);
			});

			// Overlay captions sit above the image and block clicks — attach
			// the same handler so clicking the overlay also opens the lightbox.
			const figure = img.closest("figure");
			if (figure) {
				const overlayCaption = figure.querySelector(
					"figcaption.caption-type-full-overlay, figcaption.caption-type-bar-overlay",
				);
				if (overlayCaption) {
					overlayCaption.style.cursor = "pointer";
					overlayCaption.addEventListener("click", (e) => {
						e.preventDefault();
						lightbox.openAt(idx);
					});
				}
			}
		});
	});
});

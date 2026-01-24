/**
 * Pro Lightbox Features - Thumbnails
 *
 * Enhance GLightbox with thumbnail navigation
 * This script hooks into the existing lightbox created by the free version
 */

window.addEventListener("DOMContentLoaded", () => {
	const loadImage = (img) => {
		if (!img || img.dataset.loaded) return;
		const src = img.getAttribute("data-src");
		const srcset = img.getAttribute("data-srcset");
		const sizes = img.getAttribute("data-sizes");
		if (src) img.src = src;
		if (srcset) img.srcset = srcset;
		if (sizes) img.sizes = sizes;
		img.removeAttribute("data-src");
		img.removeAttribute("data-srcset");
		img.removeAttribute("data-sizes");
		img.dataset.loaded = "true";
		img.classList.add("galleryberg-lazy-loaded");
	};

	const initLazyLoading = () => {
		const images = document.querySelectorAll("img[data-src], img[data-srcset]");
		if (!images.length) return;
		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver(
				(entries, obs) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							loadImage(entry.target);
							obs.unobserve(entry.target);
						}
					});
				},
				{ rootMargin: "200px 0px", threshold: 0.01 }
			);
			images.forEach((img) => observer.observe(img));
		} else {
			images.forEach((img) => loadImage(img));
		}
	};

	initLazyLoading();

	if (typeof GLightbox !== "function") return;

	// Store gallery data for thumbnail injection
	const galleriesWithThumbnails = new Map();

	const galleries = document.querySelectorAll(
		".galleryberg-gallery-container.galleryberg-has-lightbox"
	);

	galleries.forEach((gallery) => {
		const enableThumbnails =
			gallery.getAttribute("data-enable-thumbnails") === "true";

		// Early return if thumbnails not enabled - optimization
		if (!enableThumbnails) return;

		const thumbnailPosition =
			gallery.getAttribute("data-thumbnail-position") || "bottom";
		const thumbnailNavigation =
			gallery.getAttribute("data-thumbnail-navigation") || "direct";
		const thumbnailNavigationSpeed = parseInt(
			gallery.getAttribute("data-thumbnail-navigation-speed") || "10",
			10
		);

		const images = gallery.querySelectorAll("img");
		galleriesWithThumbnails.set(gallery, {
			images: Array.from(images),
			position: thumbnailPosition,
			navigation: thumbnailNavigation,
			navigationSpeed: thumbnailNavigationSpeed,
		});
	});

	// Use event delegation on document for better performance
	document.addEventListener("click", (e) => {
		const clickedImg = e.target.closest("img");
		if (!clickedImg) return;

		// Ignore clicks on thumbnail images
		if (clickedImg.closest(".galleryberg-thumbnails")) return;

		const gallery = clickedImg.closest(
			".galleryberg-gallery-container.galleryberg-has-lightbox"
		);
		if (!gallery) return;

		const thumbnailData = galleriesWithThumbnails.get(gallery);
		if (!thumbnailData) return;

		// Wait for lightbox to open, then inject thumbnails
		// Optimization: Use requestAnimationFrame for better timing
		requestAnimationFrame(() => {
			setTimeout(() => {
				injectThumbnails(
					gallery,
					thumbnailData.images,
					thumbnailData.position,
					thumbnailData.navigation,
					thumbnailData.navigationSpeed
				);
			}, 100); // Reduced from 150ms
		});
	});
});

/**
 * Inject thumbnail navigation into GLightbox using API
 */
function injectThumbnails(
	gallery,
	images,
	position = "bottom",
	navigation = "direct",
	navigationSpeed = 10
) {
	const container = document.querySelector("#glightbox-body .gcontainer");
	if (!container || container.querySelector(".galleryberg-thumbnails")) return;

	// Get lightbox instance from global storage
	const lightboxId = gallery.dataset.lightboxId;
	const lightbox = window.gallerybergLightboxes?.get(lightboxId);

	if (!lightbox) {
		console.warn("Galleryberg Pro: Could not find lightbox instance");
		return;
	}

	const lightboxBody = document.getElementById("glightbox-body");
	if (!lightboxBody) return;

	// Create thumbnail container
	const thumbContainer = document.createElement("div");
	thumbContainer.className = `galleryberg-thumbnails galleryberg-thumbnails-${position}`;

	// Create thumbnail wrapper for scrolling
	const thumbWrapper = document.createElement("div");
	thumbWrapper.className = "galleryberg-thumbnails-wrapper";

	// Get current slide info from lightbox API
	const slideData = lightbox.getActiveSlide();
	let currentIndex = slideData ? slideData.index : 0;

	// Navigation lock to prevent overlapping navigations
	let isNavigating = false;

	// Create document fragment for better performance
	const fragment = document.createDocumentFragment();

	// Create thumbnails
	images.forEach((img, index) => {
		const thumb = document.createElement("div");
		thumb.className = "galleryberg-thumbnail";
		if (index === currentIndex) {
			thumb.classList.add("active");
		}

		const thumbImg = document.createElement("img");
		thumbImg.src = img.dataset.thumbnail || img.dataset.src || img.src;
		thumbImg.alt = img.alt || "";
		thumbImg.loading = "lazy";

		thumb.appendChild(thumbImg);
		fragment.appendChild(thumb);

		// Click handler - use GLightbox API
		thumb.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();

			// Prevent clicks while navigating
			if (isNavigating) return;

			const targetIndex = index;

			// Use GLightbox API for navigation
			if (navigation === "direct") {
				// Direct navigation - instant using GLightbox API
				isNavigating = true;
				lightbox.goToSlide(targetIndex);

				setTimeout(() => {
					isNavigating = false;
				}, 100);
			} else {
				// Step-by-step navigation using GLightbox API
				isNavigating = true;

				// Get current index from DOM
				const allSlides = container.querySelectorAll(".gslide");
				const currentSlide = container.querySelector(".gslide.current");
				const activeIndex = Array.from(allSlides).indexOf(currentSlide);

				const diff = targetIndex - activeIndex;
				const direction = diff > 0 ? "next" : "prev";
				const steps = Math.abs(diff);

				let completedSteps = 0;

				const performStep = () => {
					if (direction === "next") {
						lightbox.nextSlide();
					} else {
						lightbox.prevSlide();
					}

					completedSteps++;

					if (completedSteps === steps) {
						setTimeout(() => {
							isNavigating = false;
						}, navigationSpeed + 50);
					}
				};

				for (let i = 0; i < steps; i++) {
					setTimeout(() => performStep(), i * navigationSpeed);
				}
			}
		});
	});

	// Append all thumbnails at once
	thumbWrapper.appendChild(fragment);
	thumbContainer.appendChild(thumbWrapper);
	container.appendChild(thumbContainer);

	/**
	 * Update active thumbnail
	 */
	function updateActiveThumbnail(index) {
		// Optimization: use cached children instead of querySelectorAll
		const thumbnails = thumbWrapper.children;
		Array.from(thumbnails).forEach((thumb, i) => {
			thumb.classList.toggle("active", i === index);
		});
	}

	/**
	 * Scroll active thumbnail into view
	 */
	function scrollThumbnailIntoView(index) {
		const thumbnail = thumbWrapper.children[index];
		if (thumbnail) {
			// Use scrollIntoView with options for better performance
			thumbnail.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		}
	}

	// Use GLightbox events instead of MutationObserver
	lightbox.on("slide_changed", ({ prev, current }) => {
		if (current && current.index !== undefined) {
			updateActiveThumbnail(current.index);
			scrollThumbnailIntoView(current.index);
			currentIndex = current.index;
		}
	});

	// Cleanup on lightbox close using GLightbox event
	lightbox.on("close", () => {
		thumbContainer.remove();
	});
}

import { __ } from "@wordpress/i18n";
import {
	createPortal,
	useState,
	useEffect,
	useCallback,
	useRef,
} from "@wordpress/element";
import { PRO_FEATURES, PROMO_CONFIG } from "./upsell-data";
import { upsellIcon } from "../../../assets/upsell-icon.js";

function execCommandCopy(text, onSuccess) {
	const el = document.createElement("textarea");
	el.value = text;
	el.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
	document.body.appendChild(el);
	el.focus();
	el.select();
	try {
		if (document.execCommand("copy")) onSuccess();
	} catch (_) {}
	document.body.removeChild(el);
}

const ChevronLeft = () => (
	<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
		<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
	</svg>
);

const ChevronRight = () => (
	<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
		<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
	</svg>
);

function UpsellModal({ onClose, featureInfo, link }) {
	const pricingLink = link || "https://galleryberg.com/pricing/";
	const { code: promoCode, text: promoText } = PROMO_CONFIG;
	const totalFeatures = PRO_FEATURES.length;

	// Find the initial index based on the passed featureInfo
	const initialIndex = featureInfo
		? PRO_FEATURES.findIndex((f) => f.name === featureInfo.name)
		: 0;

	const [activeIndex, setActiveIndex] = useState(
		initialIndex > -1 ? initialIndex : 0,
	);
	const [slideDirection, setSlideDirection] = useState("");
	const [slideKey, setSlideKey] = useState(0);
	const [copied, setCopied] = useState(false);
	const copyTimeoutRef = useRef(null);

	const handleCopyCode = useCallback(() => {
		if (!promoCode) return;

		const onSuccess = () => {
			setCopied(true);
			clearTimeout(copyTimeoutRef.current);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
		};

		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(promoCode).then(onSuccess).catch(() => {
				execCommandCopy(promoCode, onSuccess);
			});
		} else {
			execCommandCopy(promoCode, onSuccess);
		}
	}, [promoCode]);

	useEffect(() => () => clearTimeout(copyTimeoutRef.current), []);

	const goToPrev = useCallback(() => {
		setSlideDirection("slide-left");
		setSlideKey((k) => k + 1);
		setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalFeatures - 1));
	}, [totalFeatures]);

	const goToNext = useCallback(() => {
		setSlideDirection("slide-right");
		setSlideKey((k) => k + 1);
		setActiveIndex((prev) => (prev < totalFeatures - 1 ? prev + 1 : 0));
	}, [totalFeatures]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") goToPrev();
			if (e.key === "ArrowRight") goToNext();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose, goToPrev, goToNext]);

	const currentFeature = PRO_FEATURES[activeIndex];

	return createPortal(
		<div className="galleryberg-upsell-modal">
			<div
				className="galleryberg-upsell-modal-backdrop"
				onClick={onClose}
			></div>

			<div className="galleryberg-upsell-modal-outer">
				{/* Prev arrow */}
				<button
					className="galleryberg-upsell-nav galleryberg-upsell-nav-prev"
					onClick={goToPrev}
					aria-label={__("Previous feature", "galleryberg-gallery-block")}
				>
					<ChevronLeft />
				</button>

				<div className="galleryberg-upsell-modal-container">
					{/* Colored header */}
					<div className="galleryberg-upsell-modal-header">
						<span className="galleryberg-upsell-modal-header-icon">
							{upsellIcon}
						</span>
						<span className="galleryberg-upsell-modal-header-title">
							{currentFeature.title}
						</span>
					</div>

					{/* Slide content */}
					<div className="galleryberg-upsell-slide-wrapper">
						<div
							className={`galleryberg-upsell-slide ${slideDirection}`}
							key={slideKey}
						>
							{currentFeature.image && (
								<img
									className="galleryberg-upsell-modal-image"
									src={currentFeature.image}
									alt={currentFeature.title}
								/>
							)}
							{currentFeature.description && (
								<p className="galleryberg-upsell-modal-description">
									<strong>{currentFeature.title}</strong>{" "}
									{currentFeature.description}
								</p>
							)}
							{promoCode && promoText && (
								<div className="galleryberg-upsell-promo">
									<span>{promoText}</span>
									<button
										className={`galleryberg-upsell-promo-code${copied ? " is-copied" : ""}`}
										onClick={handleCopyCode}
										title={__("Click to copy", "galleryberg-gallery-block")}
									>
										<code>{promoCode}</code>
										<span className="galleryberg-upsell-promo-copy-label">
											{copied
												? __("Copied!", "galleryberg-gallery-block")
												: __("Copy", "galleryberg-gallery-block")}
										</span>
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="galleryberg-upsell-modal-footer">
						<button
							className="galleryberg-upsell-modal-cancel"
							onClick={onClose}
						>
							{__("Cancel", "galleryberg-gallery-block")}
						</button>
						<a
							className="galleryberg-upsell-modal-cta"
							href={pricingLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							{__("Buy PRO", "galleryberg-gallery-block")}
						</a>
					</div>
				</div>

				{/* Next arrow */}
				<button
					className="galleryberg-upsell-nav galleryberg-upsell-nav-next"
					onClick={goToNext}
					aria-label={__("Next feature", "galleryberg-gallery-block")}
				>
					<ChevronRight />
				</button>
			</div>
		</div>,
		document.body,
	);
}

export default UpsellModal;

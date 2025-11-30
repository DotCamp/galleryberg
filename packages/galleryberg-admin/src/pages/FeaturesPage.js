import React from "react";
import { __ } from "@wordpress/i18n";

/* global gallerybergAdminMenuData */

/**
 * Features page component.
 *
 * @class
 */
function FeaturesPage() {
	const proStatus = gallerybergAdminMenuData?.misc?.pro_status;
	const featuresData = gallerybergAdminMenuData?.features || {};
	const features = featuresData.list || [];

	return (
		<div className={"galleryberg-features-content"}>
			<div className={"galleryberg-features-header"}>
				<h2>
					{featuresData.title ||
						__("Gallery Features", "galleryberg-gallery-block")}
				</h2>
				<p>
					{featuresData.description ||
						__(
							"Explore the powerful features available in Galleryberg Gallery Block.",
							"galleryberg-gallery-block"
						)}
				</p>
			</div>

			<div className={"galleryberg-features-grid"}>
				{features.map((feature, index) => (
					<div
						key={index}
						className={`galleryberg-card galleryberg-feature-card ${
							feature.is_pro ? "is-pro-feature" : ""
						}`}
					>
						<div className={"feature-header"}>
							<h3>{feature.title}</h3>
							{feature.is_pro && (
								<span className={"pro-badge"}>
									{__("PRO", "galleryberg-gallery-block")}
								</span>
							)}
						</div>
						<p>{feature.description}</p>
						{feature.is_pro && !proStatus && (
							<a
								href="https://galleryberg.com/pricing/"
								target="_blank"
								rel="noopener noreferrer"
								className={"upgrade-link"}
							>
								{__("Upgrade to unlock →", "galleryberg-gallery-block")}
							</a>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * @module FeaturesPage
 */
export default FeaturesPage;

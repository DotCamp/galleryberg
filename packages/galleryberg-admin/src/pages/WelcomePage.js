import React from "react";
import { __ } from "@wordpress/i18n";
import ButtonLink, { ButtonLinkType } from "../components/ButtonLink";
/* global gallerybergAdminMenuData */

/**
 * Welcome content component.
 *
 * @class
 */
function WelcomePage() {
	const welcomeData = gallerybergAdminMenuData?.welcome || {};
	const videoData = gallerybergAdminMenuData?.video || {};
	const documentationData = gallerybergAdminMenuData?.documentation || {};
	const supportData = gallerybergAdminMenuData?.support || {};
	const upgradeData = gallerybergAdminMenuData?.upgrade || {};
	const proStatus = gallerybergAdminMenuData?.misc?.pro_status;

	return (
		<div className={"galleryberg-welcome-content"}>
			<div className={"galleryberg-welcome-content__main"}>
				<div className={"galleryberg-welcome-video-section galleryberg-card"}>
					<div className={"galleryberg-card-welcome"}>
						<h2>
							{welcomeData.title ||
								__("Welcome to Galleryberg!", "galleryberg-gallery-block")}
						</h2>
						<p>
							{welcomeData.content ||
								__(
									"Elevate Your Content with Beautiful Galleries - The Ultimate WordPress Block Editor Plugin for Effortless Gallery Creation!",
									"galleryberg-gallery-block"
								)}
						</p>
					</div>
					<div className={"galleryberg-card-video"}>
						<div className={"galleryberg-video-wrapper"}>
							<iframe
								width="560"
								height="315"
								src={`https://www.youtube.com/embed/${videoData.video_id}`}
								title={
									videoData.title ||
									__("Galleryberg Tutorial", "galleryberg-gallery-block")
								}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						</div>
					</div>
				</div>
				{!proStatus && upgradeData.title && (
					<div className={"galleryberg-card galleryberg-card-upgrade"}>
						<h3>{upgradeData.title}</h3>
						<p>{upgradeData.content}</p>
						<a
							href={upgradeData.url || "https://galleryberg.com/pricing/"}
							target="_blank"
							rel="noopener noreferrer"
							className={"button button-primary button-upgrade"}
						>
							{upgradeData.button ||
								__("GET GALLERYBERG PRO", "galleryberg-gallery-block")}
						</a>
					</div>
				)}
			</div>
			<div className={"galleryberg-welcome-content__sidebar"}>
				<div className={"galleryberg-card"}>
					<h3>
						{documentationData.title ||
							__("Documentation", "galleryberg-gallery-block")}
					</h3>
					<p>
						{documentationData.content ||
							__(
								"Elevate your space with Galleryberg: a sleek, modern gallery block for style and functionality.",
								"galleryberg-gallery-block"
							)}
					</p>
					<ButtonLink
						url={documentationData.url || "https://galleryberg.com/docs/"}
						title={__("Visit Documents", "galleryberg-gallery-block")}
						type={ButtonLinkType.DEFAULT}
					/>
				</div>

				<div className={"galleryberg-card"}>
					<h3>
						{supportData.title || __("Support", "galleryberg-gallery-block")}
					</h3>
					<p>
						{supportData.content ||
							__(
								"Visit our Galleryberg Support Page for quick solutions and assistance.",
								"galleryberg-gallery-block"
							)}
					</p>
					<ButtonLink
						url={supportData.url || "https://galleryberg.com/support/"}
						title={__("Support Forum", "galleryberg-gallery-block")}
						type={ButtonLinkType.DEFAULT}
					/>
				</div>
			</div>
		</div>
	);
}

/**
 * @module WelcomePage
 */
export default WelcomePage;

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
						<h2>{welcomeData.title}</h2>
						<p>{welcomeData.content}</p>
					</div>
					<div className={"galleryberg-card-video"}>
						<div className={"galleryberg-video-wrapper"}>
							<iframe
								width="560"
								height="315"
								src={`https://www.youtube.com/embed/${videoData.video_id}`}
								title={videoData.title}
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
							{upgradeData.button}
						</a>
					</div>
				)}
			</div>
			<div className={"galleryberg-welcome-content__sidebar"}>
				<div className={"galleryberg-card"}>
					<h3>{documentationData.title}</h3>
					<p>{documentationData.content}</p>
					<ButtonLink
						url={documentationData.url || "https://galleryberg.com/docs/"}
						title={documentationData.button}
						type={ButtonLinkType.DEFAULT}
					/>
				</div>

				<div className={"galleryberg-card"}>
					<h3>{supportData.title}</h3>
					<p>{supportData.content}</p>
					<ButtonLink
						url={supportData.url || "https://galleryberg.com/contact/"}
						title={supportData.button}
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

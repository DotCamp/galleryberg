import { __ } from "@wordpress/i18n";
import React, { useEffect, useMemo } from "react";
import Navigation from "./Navigation";
import { routeObjects } from "../inc/routes";
import ButtonLink, { ButtonLinkType } from "./ButtonLink";
import VersionControl from "./VersionControl";

/* global gallerybergAdminMenuData */

/**
 * Settings menu header element.
 *
 * @return {JSX.Element} component
 */
function MenuHeader({ currentRoutePath, setCurrentRoutePath }) {
	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set("route", currentRoutePath);
		window.history.pushState(null, null, url.href);
	}, [currentRoutePath]);

	const routeObjectsMinus404 = useMemo(() => {
		return routeObjects.slice(0, routeObjects.length - 1);
	}, []);

	const logoUrl = gallerybergAdminMenuData?.assets?.logo;
	const proStatus = gallerybergAdminMenuData?.misc?.pro_status;
	const versionData = gallerybergAdminMenuData?.versionControl;

	/**
	 * Rollback plugin version.
	 *
	 * @param {string} version target version
	 * @return {Promise} action promise
	 */
	const rollbackToVersion = (version) => {
		if (!versionData?.ajax?.versionRollback) {
			return Promise.reject({
				message: __(
					"Version control data not available",
					"galleryberg-gallery-block"
				),
			});
		}

		const { url, action, nonce } = versionData.ajax.versionRollback;

		const formData = new FormData();
		formData.append("action", action);
		formData.append("nonce", nonce);
		formData.append("version", version);

		return fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((resp) => resp.json())
			.then((data) => {
				if (data.error || !data.success) {
					throw new Error(data.error || data.data?.error || "Unknown error");
				}
				return { message: data.data?.message || "Success" };
			})
			.catch((error) => {
				return Promise.reject({ message: error.message });
			});
	};

	return (
		<div className={"header-wrapper"}>
			<div className={"menu-header"}>
				<div className={"left-container"}>
					<div className={"logo-container"}>
						{logoUrl && <img alt={"plugin logo"} src={logoUrl} />}
						<div className={"galleryberg-plugin-logo-text"}>Galleryberg</div>
					</div>
				</div>
				<div className={"galleryberg-menu-navigation-wrapper"}>
					<Navigation
						routes={routeObjectsMinus404}
						currentRoutePath={currentRoutePath}
						setRoute={setCurrentRoutePath}
					/>
				</div>
				<div className={"right-container"}>
					{versionData && versionData.currentVersion && (
						<div className={"version-control-header-wrapper"}>
							<VersionControl
								pluginVersion={versionData.currentVersion}
								allVersions={versionData.versions || []}
								onVersionRollBack={rollbackToVersion}
							/>
						</div>
					)}
					{!proStatus && (
						<ButtonLink
							url={"https://galleryberg.com/pricing/"}
							title={__("Upgrade to PRO", "galleryberg-gallery-block")}
							type={ButtonLinkType.DEFAULT}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

/**
 * @module MenuHeader
 */
export default MenuHeader;

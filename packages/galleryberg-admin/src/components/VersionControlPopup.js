import React, { useRef, useState } from "react";
import { __ } from "@wordpress/i18n";

/**
 * Version control popup component.
 *
 * @param {Object}   props                  component properties
 * @param {string}   props.from             current version
 * @param {string}   props.to               version to rollback
 * @param {Function} props.onCloseHandler   close popup callback
 * @param {Function} props.onOperationStart operation start callback
 * @param {number}   props.reloadDelay      automatic page reload delay in milliseconds
 * @class
 */
function VersionControlPopup({
	from,
	to,
	onCloseHandler,
	onOperationStart,
	reloadDelay = 5000,
}) {
	const OPERATION_STATUS_TYPES = {
		NOT_STARTED: "notStarted",
		STARTED: "started",
		FINISHED: "finished",
	};

	const RESPONSE_TYPES = {
		OK: "ok",
		ERROR: "error",
	};

	const generateResponseObject = (message, type = RESPONSE_TYPES.OK) => {
		return {
			type,
			message,
		};
	};

	const [operationStatus, setOperationStatus] = useState(
		OPERATION_STATUS_TYPES.NOT_STARTED
	);
	const [reloadCountdown, setReloadCountdown] = useState(reloadDelay / 1000);
	const [responseObject, setResponseObject] = useState(
		generateResponseObject("")
	);

	const isDowngrade = from > to;
	const countdownToReload = useRef(reloadDelay);

	const startOperation = () => {
		setOperationStatus(OPERATION_STATUS_TYPES.STARTED);
		onOperationStart()
			.then(({ message }) => {
				setResponseObject(generateResponseObject(message, RESPONSE_TYPES.OK));
			})
			.catch(({ message }) => {
				setResponseObject(
					generateResponseObject(message, RESPONSE_TYPES.ERROR)
				);
			})
			.finally(() => {
				setOperationStatus(OPERATION_STATUS_TYPES.FINISHED);
				reloadPage();
			});
	};

	const reloadPage = () => {
		const reloadIntervalId = setInterval(() => {
			if (countdownToReload.current <= 0) {
				window.location.reload();
				clearInterval(reloadIntervalId);
			} else {
				countdownToReload.current = countdownToReload.current - 1000;
				setReloadCountdown(countdownToReload.current / 1000);
			}
		}, 1000);
	};

	return (
		<div className={"version-control-popup"}>
			<div
				className={"modal-backdrop"}
				onClick={onCloseHandler}
				role="presentation"
			></div>
			<div className={"modal-container"}>
				<div className={"rollback-versions"}>
					<div
						className={`version-id ${
							isDowngrade ? "version-positive" : "version-negative"
						}`}
					>
						{from}
					</div>
					<div
						className={"version-icon"}
						data-in-progress={JSON.stringify(
							operationStatus === OPERATION_STATUS_TYPES.STARTED
						)}
					>
						<div className={"version-icon-inner"}>
							<svg
								aria-hidden="true"
								focusable="false"
								data-prefix="fas"
								data-icon="right-long"
								className="svg-inline--fa fa-right-long"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
							>
								<path
									fill="currentColor"
									d="M334.5 414c8.8 3.8 19 2 26-4.6l144-136c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 72L32 192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l288 0 0 72c0 9.6 5.7 18.2 14.5 22z"
								></path>
							</svg>
						</div>
					</div>
					<div
						className={`version-id ${
							isDowngrade ? "version-negative" : "version-positive"
						}`}
					>
						{to}
					</div>
				</div>
				{operationStatus !== OPERATION_STATUS_TYPES.STARTED && (
					<div className={"version-content"}>
						{operationStatus === OPERATION_STATUS_TYPES.NOT_STARTED && (
							<div className={"version-warning"}>
								<div>
									{__(
										"Older versions might be unstable. Do it on your own risk and create a backup.",
										"galleryberg-gallery-block"
									)}
								</div>
								<div className={"version-button-container"}>
									<button
										className="button button-primary"
										onClick={startOperation}
									>
										{__("Start", "galleryberg-gallery-block")}
									</button>
									<button
										className="button button-secondary"
										onClick={onCloseHandler}
									>
										{__("Close", "galleryberg-gallery-block")}
									</button>
								</div>
							</div>
						)}
						{operationStatus === OPERATION_STATUS_TYPES.FINISHED && (
							<div className={"operation-finished-wrapper"}>
								<div
									className={"version-control-response"}
									data-resp-type={responseObject.type}
								>
									{responseObject.message}
								</div>
								<div>
									{reloadCountdown <= 0
										? `${__(
												"Reloading page now…",
												"galleryberg-gallery-block"
										  )}`
										: `${__(
												"Reloading page in ",
												"galleryberg-gallery-block"
										  )} ${reloadCountdown}...`}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * @module VersionControlPopup
 */
export default VersionControlPopup;

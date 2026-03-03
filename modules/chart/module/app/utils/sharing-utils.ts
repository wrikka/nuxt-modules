import type { SocialPlatform, ShareResult } from "../types/sharing";

/**
 * Share to Twitter
 */
export const shareToTwitter = async (
	message: string,
	hashtags: string[],
	url: string,
): Promise<ShareResult> => {
	const params = new URLSearchParams({
		text: `${message} ${url}`,
		hashtags: hashtags.join(","),
	});

	const shareUrl = `https://twitter.com/intent/tweet?${params.toString()}`;

	// Open share dialog
	window.open(shareUrl, "_blank", "width=600,height=400");

	return {
		success: true,
		platform: "twitter",
		url: shareUrl,
	};
};

/**
 * Share to Facebook
 */
export const shareToFacebook = async (
	message: string,
	url: string,
): Promise<ShareResult> => {
	const params = new URLSearchParams({
		u: url,
		quote: message,
	});

	const shareUrl = `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;

	window.open(shareUrl, "_blank", "width=600,height=400");

	return {
		success: true,
		platform: "facebook",
		url: shareUrl,
	};
};

/**
 * Share to LinkedIn
 */
export const shareToLinkedIn = async (
	message: string,
	url: string,
): Promise<ShareResult> => {
	const params = new URLSearchParams({
		url: url,
		title: message.substring(0, 200),
	});

	const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;

	window.open(shareUrl, "_blank", "width=600,height=400");

	return {
		success: true,
		platform: "linkedin",
		url: shareUrl,
	};
};

/**
 * Share to Reddit
 */
export const shareToReddit = async (
	title: string,
	message: string,
	url: string,
): Promise<ShareResult> => {
	const params = new URLSearchParams({
		url: url,
		title: title,
	});

	const shareUrl = `https://reddit.com/submit?${params.toString()}`;

	window.open(shareUrl, "_blank", "width=800,height=600");

	return {
		success: true,
		platform: "reddit",
		url: shareUrl,
	};
};

/**
 * Share to Telegram
 */
export const shareToTelegram = async (
	message: string,
	url: string,
): Promise<ShareResult> => {
	const params = new URLSearchParams({
		url: url,
		text: message,
	});

	const shareUrl = `https://t.me/share/url?${params.toString()}`;

	window.open(shareUrl, "_blank", "width=600,height=400");

	return {
		success: true,
		platform: "telegram",
		url: shareUrl,
	};
};

/**
 * Share to WhatsApp
 */
export const shareToWhatsApp = async (
	message: string,
	url: string,
): Promise<ShareResult> => {
	const fullMessage = `${message}\n\n${url}`;
	const encodedMessage = encodeURIComponent(fullMessage);

	const shareUrl = `https://wa.me/?text=${encodedMessage}`;

	// For mobile, try to open WhatsApp app, fallback to web
	if (
		/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		)
	) {
		window.location.href = `whatsapp://send?text=${encodedMessage}`;
		// Fallback after a delay
		setTimeout(() => {
			window.open(shareUrl, "_blank");
		}, 1000);
	} else {
		window.open(shareUrl, "_blank");
	}

	return {
		success: true,
		platform: "whatsapp",
		url: shareUrl,
	};
};

/**
 * Share via email
 */
export const shareToEmail = async (
	subject: string,
	message: string,
	url: string,
): Promise<ShareResult> => {
	const body = `${message}\n\nView chart: ${url}`;
	const encodedSubject = encodeURIComponent(subject);
	const encodedBody = encodeURIComponent(body);

	const mailtoUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

	window.location.href = mailtoUrl;

	return {
		success: true,
		platform: "email",
		url: mailtoUrl,
	};
};

/**
 * Copy link to clipboard
 */
export const copyToClipboard = async (url: string): Promise<ShareResult> => {
	try {
		await navigator.clipboard.writeText(url);
		// Show some user feedback (in real app, would use toast notification)
		console.log("Link copied to clipboard:", url);
		return {
			success: true,
			platform: "copy-link",
			url,
		};
	} catch (error) {
		// Fallback for older browsers
		const textArea = document.createElement("textarea");
		textArea.value = url;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("copy");
		document.body.removeChild(textArea);

		return {
			success: true,
			platform: "copy-link",
			url,
		};
	}
};

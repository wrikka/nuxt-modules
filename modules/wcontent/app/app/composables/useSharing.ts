export function useSharing() {
	const shareToTwitter = (url: string, title: string) => {
		const text = encodeURIComponent(`${title} ${url}`);
		window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
	};

	const shareToFacebook = (url: string) => {
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
	};

	const shareToLinkedIn = (url: string, title: string) => {
		window.open(
			`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${
				encodeURIComponent(title)
			}`,
			"_blank",
		);
	};

	const shareToWhatsApp = (url: string, title: string) => {
		const text = encodeURIComponent(`${title} ${url}`);
		window.open(`https://wa.me/?text=${text}`, "_blank");
	};

	const copyToClipboard = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url);
			return true;
		} catch {
			return false;
		}
	};

	return {
		shareToTwitter,
		shareToFacebook,
		shareToLinkedIn,
		shareToWhatsApp,
		copyToClipboard,
	};
}

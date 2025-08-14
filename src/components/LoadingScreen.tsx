import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
	const [imgError, setImgError] = useState(false);

	useEffect(() => {
		document.body.classList.add("overflow-hidden");
		return () => document.body.classList.remove("overflow-hidden");
	}, []);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
			<div className="flex flex-col items-center text-black dark:text-white">
				{imgError ? (
					<LoaderCircle size={100} className="animate-spin mb-4" />
				) : (
					<img
						width={200}
						height={200}
						src="/loading_animation.avifs"
						loading="eager"
						decoding="async"
						fetchPriority="high"
						onError={() => setImgError(true)}
					/>
				)}
				<p className="text-2xl font-bold">Loading...</p>
			</div>
		</div>
	);
}

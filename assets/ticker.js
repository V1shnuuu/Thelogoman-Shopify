(function () {
	const ticker = () => {
		$(".ticker").each(function () {
			if ($(this).hasClass("slider_started")) return;

			$(this).addClass("slider_started");

			const tickerId = $(this).data("ticker-id");
			const wrapper = $(`.ticker-js-${tickerId}`);
			const children = wrapper.children();
			const speed = $(this).data("ticker-speed") * 1000;

			if (!wrapper.data("duplicated")) {
				children.clone().appendTo(wrapper);
				wrapper.data("duplicated", true);
			}

			// Measure full scroll width (original + clones)
			const fullWidth = wrapper[0].scrollWidth;			

			const animationDuration = (fullWidth / 100) * speed / 10000;

			wrapper.css({
				animation: `ticker-scroll ${animationDuration}s linear infinite`
			});

			wrapper
				.on("mouseenter", function () {
					$(this).css("animation-play-state", "paused");
				})
				.on("mouseleave", function () {
					$(this).css("animation-play-state", "running");
				});
		});
	};

	ticker();

	document.addEventListener("shopify:section:load", () => setTimeout(ticker, 100));

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) {
			$(".ticker-js").each(function () {
				$(this).removeAttr("style").data("duplicated", false);
			});
			ticker();
		}
	});

	setTimeout(ticker, 100);
})();

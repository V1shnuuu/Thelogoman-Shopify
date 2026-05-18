(function () {
	const initTimer = () => {
		$(".js-countdown").each(function () {
			const mockTimer = $(this).data("mock-timer");
			const completedCountdown = $(this).data("completed");
			const countdown = $(this).find(".countdown__body");
			const wrapper = $(this).find(".countdown__wrapper");
			const countdownHeading = $(this).find(".countdown__heading");
			const daysEl = $(this).find(".countdown__block__days");
			const hoursEl = $(this).find(".countdown__block__hours");
			const minutesEl = $(this).find(".countdown__block__minutes");
			const secondsEl = $(this).find(".countdown__block__seconds");
			const section = $(this).parent(".shopify-section");

			let userDate, userTime, userTimeZone;
			
			// Check if mock timer is enabled
			if (mockTimer === true) {
				// Calculate 3 days from now with specific time logic
				const d = new Date();
				d.setDate(d.getDate() + 3);

				const year = d.getFullYear();
				const m = d.getMonth() + 1;
				const month = m < 10 ? "0" + m : m;
				const day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();

				let h = d.getHours() - 1;
				// Handle hour overflow (if hours exceed 24, it rolls to next day)
				if (h >= 24) {
					h = h - 24;
					d.setDate(d.getDate() + 1);
				}
				const hourss = h < 10 ? "0" + h : h;
				const minutess = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

				userDate = year + "-" + month + "-" + day;
				userTime = hourss + ":" + minutess;
				userTimeZone = 0; // Use local timezone for mock timer
			} else {
				// Use real countdown data
				userDate = $(this).data("date");
				userTime = $(this).data("time");
				userTimeZone = +$(this).data("timezone");
			}

			// ----------------------------------------------------------------

			let date = new Date();
			let utcTime = date.getTime();
			let timezoneOffset = date.getTimezoneOffset();
			let offsetInMilliseconds = timezoneOffset * 60 * 1000;
			let targetTimezoneOffset = userTimeZone * 60;
			let targetOffsetInMilliseconds = targetTimezoneOffset * 60 * 1000;
			let targetTime =
				utcTime + offsetInMilliseconds + targetOffsetInMilliseconds;

			let targetDate = new Date(targetTime);

			// ----------------------------------------------------------------

			const countdownDate = new Date(`${userDate}T${userTime}`);
			const now = targetDate;
			const distance = countdownDate.getTime() - now.getTime();
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);
			// ----------------------------------------------------------------
			if (distance < 0 && completedCountdown === "hide_section") {
				clearInterval(initTimer);
				section.stop(false, false).fadeOut(0);
			} else if (distance < 0 && completedCountdown === "show_text") {
				countdown.stop(false, false).fadeOut(0);
				wrapper.addClass("show-text");
				countdownHeading.stop(false, false).fadeIn();
			} else {
				daysEl.html(days < 10 ? "0" + days : days);
				hoursEl.html(hours < 10 ? "0" + hours : hours);
				minutesEl.html(minutes < 10 ? "0" + minutes : minutes);
				secondsEl.html(seconds < 10 ? "0" + seconds : seconds);
			}
			// ----------------------------------------------------------------
		});
	};
	document.addEventListener("shopify:section:load", function () {
		if (!document.hidden) {
			setInterval(initTimer, 1000);
		}
	});
	if (!document.hidden) {
		setInterval(initTimer, 1000);
	}
})();
(function () {
	const tickSlider = () => {
		$(".countdown__ticker").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const tickerId = $(this).data("ticker-id");
			const tickerSpeed = $(this).data("ticker-speed") * 1000;
			const tickerSwiper = new Swiper(`.ticker-js-${tickerId}`, {
				slidesPerView: "auto",
				speed: tickerSpeed,
				initialSlide: 0,
				loop: true,
				loopedSlides: 50,
				allowTouchMove: false,
				waitForTransition: false,
				watchSlidesProgress: false,
				autoplay: {
					delay: 0,
					disableOnInteraction: false,
				},
			});
		});
	};

	tickSlider();
	document.addEventListener("shopify:section:load", function () {
		setTimeout(() => {
			tickSlider();
		}, 100);
	});

	document.addEventListener("visibilitychange", function () {
		if (!document.hidden) {
			$(".ticker-js").each(function () {
				this.swiper.destroy();
			});
			tickSlider();
		}
	});

	setTimeout(() => {
		tickSlider();
	}, 100);
})();

;(function () {
	const mobileViewXP = 750
	const mySwipers = {}
	const mobileLayoutTypes = {
		slider: 'slider',
		grid: 'grid',
	}

	const destroySlider = (slider) => {
		const sectionId = slider.dataset.id
		const slides = slider.querySelectorAll('.products-slider__swiper')
		const swiperWrapper = slider.querySelector(
			'.products-slider__swiper-wrapper'
		)
		const pagination = slider.querySelector('.products-slider-pagination')

		if (slider?.swiper) slider.swiper.destroy()

		if (pagination && !pagination?.classList?.contains('hide-pagination')) {
			pagination?.classList?.add('hide-pagination')
		}

		if (swiperWrapper && !swiperWrapper?.classList?.contains('products-grid')) {
			swiperWrapper?.classList?.add('products-grid')
			swiperWrapper?.classList?.remove('swiper-wrapper')
		}

		slides.forEach((slide) => {
			slide.removeAttribute('style')
			slide.classList.remove('swiper')
			slide
				.querySelectorAll('.products-slider__slide')
				.forEach((element) => element.classList.remove('swiper-slide'))
		})

		if (mySwipers[sectionId] && mySwipers[sectionId] != null) {
			slider.classList?.add('destroyed')
			mySwipers[sectionId].destroy(true, true)
			mySwipers[sectionId] = null
		}
	}

	const updateSliderClasses = (slider) => {
		const pagination = slider.querySelector('.products-slider-pagination')
		const mySwiper  = slider.querySelector('.mySwiper ')
		const swiperWrapper = slider.querySelector(
			'.products-slider__swiper-wrapper'
		)

		if (
			swiperWrapper &&
			!swiperWrapper?.classList?.contains('swiper-wrapper')
		) {
			swiperWrapper?.classList?.add('swiper-wrapper')
			swiperWrapper?.classList?.remove('products-grid')
			mySwiper.classList.add('swiper')
			swiperWrapper
				.querySelectorAll('.products-slider__slide')
				.forEach((element) => element.classList.add('swiper-slide'))
		}

		if (pagination && pagination?.classList?.contains('hide-pagination')) {
			pagination?.classList?.remove('hide-pagination')
		}
	}

	const initSlider = (slider) => {
		if (
			slider.classList.contains('destroyed') ||
			(!slider.classList.contains('destroyed') &&
				!slider.classList.contains('slider_started'))
		) {
			slider?.classList?.remove('destroyed')
			updateSliderClasses(slider)
		} else if (slider.classList.contains('slider_started')) {
			return ''
		}

		slider.classList.add('slider_started')

		const sectionId = slider.dataset.id

		const perRow = slider.dataset.perRow
		const mobile = slider.dataset.mobile
		const speed = slider.dataset.speed * 1000
		const delay = slider.dataset.delay * 1000
		const autoplay = toBoolean(slider.dataset.autoplay)
		const stopAutoplay = toBoolean(slider.dataset.stopAutoplay)
		const showArrows = toBoolean(slider.dataset.showArrows)
		let autoplayParm = {}
		let arrowsParm = {}
		if (autoplay) {
			autoplayParm = {
				autoplay: {
					delay: delay,
					pauseOnMouseEnter: stopAutoplay,
					disableOnInteraction: false,
				},
			}
		}
		if (showArrows) {
			arrowsParm = {
				navigation: {
					nextEl: `#${sectionId} .swiper-button-next`,
					prevEl: `#${sectionId} .swiper-button-prev`,
				},
				pagination: {
					el: `#${sectionId} .products-slider-pagination`,
					clickable: true,
				},
			}
		}
		let swiperParms = {
			speed: speed,

			keyboard: true,
			slidesPerView: mobile,
			spaceBetween: 16,
			breakpoints: {
				576: {
					slidesPerView: perRow >= 2 ? 2 : 1,
				},
				750: {
					slidesPerView: perRow >= 3 ? 3 : perRow,
				},
				990: {
					slidesPerView: perRow >= 4 ? 4 : perRow,
				},
				1150: {
					spaceBetween: 16,
					slidesPerView: perRow,
				},
			},
			...arrowsParm,
			...autoplayParm,
		}

		mySwipers[sectionId] = new Swiper(`#${sectionId} .swiper`, swiperParms)
	}

	const productSlider = () => {
		const productSliders = Array.from(
			document.querySelectorAll('.products-slider')
		)

		if (productSliders.length === 0) return
		productSliders.forEach((slider) => {
			const sectionResizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					const mobileLayoutType = entry.target.dataset.mobileLayoutType

					if (
						entry.contentRect.width < mobileViewXP &&
						mobileLayoutType === mobileLayoutTypes.grid
					) {
						destroySlider(entry.target)
					} else {
						initSlider(entry.target)
					}
				})
			})

			sectionResizeObserver.observe(slider)
		})
	}

	function toBoolean(string) {
		return string === 'true' ? true : false
	}

	if (document.querySelector('product-recommendations') !== null) {
		const initslider = setInterval(() => {
			if (
				document
					.querySelector('product-recommendations')
					.querySelector('.swiper') !== null
			) {
				if (
					document
						.querySelector('product-recommendations')
						.querySelector('.swiper')
						.classList.contains('swiper-initialized')
				) {
					clearInterval(initslider)
				}
				productSlider()
			}
		}, 100)
	}

	document.addEventListener('DOMContentLoaded', function () {
		productSlider()
		document.addEventListener('shopify:section:load', function (event) {
			productSlider()
		})
	})
})()

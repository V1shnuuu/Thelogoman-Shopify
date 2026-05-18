(function () {
    const initPopularProducts = (section) => {
          const $section = $(section);
  
          if ($section.hasClass("slider_started")) {
              return;
          }
  
          $section.addClass("slider_started");
  
          let id = $section.attr("id");
          let slideEl = $section.find(".swiper-wrapper");
          let productCount = parseInt(slideEl.data("count"));
          let productCountMobile = parseInt(slideEl.data("count-mobile"));
  
          let prodSwiperParams = {
              loop: false,
              autoHeight: false,
              allowTouchMove: true,
              slidesPerView: productCount,
              lazy: true,
              preloadImages: false,
              spaceBetween: 24,
              navigation: {
                  nextEl: `#${id} .swiper-button-next`,
                  prevEl: `#${id} .swiper-button-prev`,
              },
              watchSlidesProgress: true,
              preventInteractionOnTransition: true,
              mousewheel: {
                  forceToAxis: true,
              },
          };
  
          let swiper = new Swiper(
              `#${id} .product-carousel-swiper`,
              prodSwiperParams
          );
  
          swiper.on("resize", function () {
              const w = window.innerWidth;
  
              if (productCount === 6) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 :
                      w < 1100 ? 3 :
                      w < 1360 ? 4 :
                      w < 1600 ? 5 : 6;
  
              } else if (productCount === 5) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 :
                      w < 1100 ? 3 :
                      w < 1360 ? 4 : 5;
  
              } else if (productCount === 4) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 :
                      w < 1100 ? 3 : 4;
  
              } else if (productCount === 3) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile :
                      w < 750 ? 2 : 3;
  
              } else if (productCount === 2) {
                  this.params.slidesPerView =
                      w < 576 ? productCountMobile : 2;
              }
          });
    };
  
    const initSection = async (section) => {
      if (!section || !section?.classList.contains("recently-viewed-section")) {
        return;
      }
  
      const box = section.querySelector(".recently-viewed");
      if (!box) return;
  
      const STORAGE_KEY = "__sf_theme_recently";
      const EXPIRATION_DAYS = box.dataset.expirationDays
        ? Number(box.dataset.expirationDays)
        : 30;
      const dateNow = Date.now();
  
      const baseUrl = box.dataset.baseUrl;
      const productsLimit = Number(box.dataset.productsLimit) || 6;
      const currentPageProductId = box.dataset.currentPageProductId;
  
      // get recent products from local storage
      let recentProducts = [];
      try {
        recentProducts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        console.error(`Incorrect value in local storage for "${STORAGE_KEY}"`);
      }
  
      if (currentPageProductId) {
        recentProducts = recentProducts.filter(
          (item) => item.productId !== currentPageProductId
        );
      }
  
      if (recentProducts.length === 0) {
        box.classList.remove("recently-viewed--loading");
        box.classList.add("recently-viewed--empty");
        return;
      }
  
      // filter by expiration time
      const expirationTime = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
      const validProducts = recentProducts.filter(
        (item) => dateNow - item.timestamp < expirationTime
      );
  
      // limit by section setting
      const limitedProducts = validProducts.slice(0, productsLimit);
  
      // get url with query
      const query = limitedProducts
        .filter((item) => item.productId)
        .map((item) => `id:${item.productId}`)
        .join("%20OR%20");
      const url = `${baseUrl}&q=${query}`;
  
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const sourceBox = doc?.querySelector(".recently-viewed");
        if (!sourceBox?.classList.contains("recently-viewed--search-perfomed")) {
          box.classList.add("recently-viewed--empty");
          return;
        }
        box.innerHTML = sourceBox.innerHTML;
  
        initPopularProducts(section);
        try {
          colorSwatches();
        } catch (err) {
  
              }
      } catch (error) {
        console.error("Failed to fetch recently viewed products:", error);
        box.classList.add("recently-viewed--empty");
      } finally {
        box.classList.remove("recently-viewed--loading");
      }
    };
  
    initSection(document.currentScript.parentElement);
  
    document.addEventListener("shopify:section:load", function (event) {
      initSection(event.target);
    });
  })();
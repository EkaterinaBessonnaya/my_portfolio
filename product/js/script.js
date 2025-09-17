"use strict";

window.addEventListener("load", windowLoad);

let isMobile;

function windowLoad() {
  isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  isMobile.any() ? document.body.setAttribute("data-touch", "") : null;

  document.addEventListener("click", documentAction);
  document.addEventListener("input", documentAction);

  const coundown = document.querySelectorAll("[data-countdown]");
  const priceFilter = document.querySelectorAll(".price-filter");

  if (coundown.length) {
    initCoundown(coundown);
  }

  if (priceFilter.length) {
    priceFilterInit();
  }

  dynamicAdaptHeader();
  dynamicAdaptFilter();
  sliderInit();
}

function dynamicAdaptHeader() {
  const topHeader = document.querySelector(".top-header");
  const header = document.querySelector(".header");
  const menu = document.querySelector(".menu");
  const phoneHeader = document.querySelector(".bottom-header__phone");
  const searchHeader = document.querySelector(".search-header");

  const bottomContainer = document.querySelector(".bottom-header__container");
  const actionHeader = document.querySelector(".actions-header");
  const placeSearch = document.querySelector(".middle-header__place-search");

  if (header) {
    const media = window.matchMedia("(max-width: 767.98px)");

    media.addEventListener("change", (e) => {
      dynamicAdaptHeaderInit(media);
    });

    dynamicAdaptHeaderInit(media);
  }

  function dynamicAdaptHeaderInit(media) {
    if (media.matches) {
      bottomContainer.insertAdjacentElement("beforeend", searchHeader);
      actionHeader.insertAdjacentElement("beforeend", phoneHeader);
      menu.insertAdjacentElement("beforeend", topHeader);
    } else {
      bottomContainer.insertAdjacentElement("beforeend", phoneHeader);
      placeSearch.insertAdjacentElement("beforeend", searchHeader);
      header.insertAdjacentElement("afterbegin", topHeader);
    }

    searchHeader.classList.toggle("--dynamic", media.matches);
    phoneHeader.classList.toggle("--dynamic", media.matches);
  }
}

function dynamicAdaptFilter() {
  const filter = document.querySelector(".filter");
  const filterPlace = document.querySelector(".header-catalog__filter");
  const catalogBody = document.querySelector(".catalog__body");

  if (filter) {
    const media = window.matchMedia("(max-width: 767.98px)");

    media.addEventListener("change", (e) => {
      dynamicAdaptFilterInit(media);
    });

    dynamicAdaptFilterInit(media);
  }

  function dynamicAdaptFilterInit(media) {
    if (media.matches) {
      filterPlace.insertAdjacentElement("beforeend", filter);
    } else {
      catalogBody.insertAdjacentElement("afterbegin", filter);
    }
  }
}

function documentAction(e) {
  const eventType = e.type;
  const targetElement = e.target;

  if (eventType === "click") {
    if (isMobile.any()) {
      if (targetElement.closest(".menu__button")) {
        const subMenu =
          targetElement.closest(".menu__button").nextElementSibling;

        if (subMenu) {
          subMenu.closest(".menu__item").classList.toggle("--active");
        }
      } else {
        const menuItemActive = document.querySelectorAll(
          ".menu__item.--active"
        );

        if (menuItemActive.length) {
          menuItemActive.forEach((menuItemActiveItem) => {
            menuItemActiveItem.classList.remove("--active");
          });
        }
      }
    }

    if (targetElement.closest(".icon-menu")) {
      document.body.classList.toggle("scroll-lock");
      document.documentElement.classList.toggle("open-menu");
    }

    if (targetElement.closest(".header-catalog__button")) {
      document.documentElement.classList.toggle("open-filter");
    }

    if (targetElement.closest(".add-to-card")) {
      const button = targetElement.closest(".add-to-card");
      const productItem = button.closest(".item-product");
      const productImage = productItem.querySelector(".item-product__image");
      const cardHeader = document.querySelector(".card-header__icon-bag span");

      flyImage(productImage, cardHeader);
    }

    if (targetElement.closest(".quantity__button")) {
      const button = targetElement.closest(".quantity__button");
      const quantity = button.parentElement;
      const input = quantity.querySelector("input");
      let inputValue = +input.value;

      if (button.classList.contains("quantity__button--icon-minus")) {
        --inputValue;
      } else {
        ++inputValue;
      }
      input.value = inputValue <= 0 ? 1 : inputValue;
    }

    if (targetElement.closest(".tabs-product__button")) {
      const tabButton = targetElement.closest(".tabs-product__button");

      if (!tabButton.classList.contains('tabs-product__button--active')) {
        const activeTab = document.querySelector(".body-tabs-product__item--active");
        const activeNavTab = document.querySelector(".tabs-product__button--active");
        activeTab ? activeTab.classList.remove("body-tabs-product__item--active") : null;
        activeNavTab ? activeNavTab.classList.remove("tabs-product__button--active") : null;

        tabButton.classList.add('tabs-product__button--active');

        const navParent = tabButton.parentElement.parentElement;
        const activeTabIndex = indexInParent(navParent, tabButton.parentElement);

        const tabs = document.querySelectorAll(".body-tabs-product__item");
        tabs[activeTabIndex].classList.add("body-tabs-product__item--active");
      }
    }

  } else if (eventType === 'input') {
    if (targetElement.classList.contains("quantity__input")) {
      targetElement.value <= 0 ? targetElement.value = 1 : null;
    }
  }
}

function flyImage(productImage, cardHeader) {
  const flyImg = document.createElement("img");
  const speed = 2000;

  flyImg.src = productImage.src;
  flyImg.style.cssText = `
    position: absolute;
    transition-duration: ${speed}ms;
    z-index: 50;
    width: ${productImage.offsetWidth}px;
    left: ${productImage.getBoundingClientRect().left + scrollX}px;
    top: ${productImage.getBoundingClientRect().top + scrollY}px;
  `;

  document.body.insertAdjacentElement("beforeend", flyImg);

  flyImg.style.left = `${cardHeader.getBoundingClientRect().left + scrollX}px`;
  flyImg.style.top = `${cardHeader.getBoundingClientRect().top + scrollY}px`;
  flyImg.style.width = `10px`;
  // flyImg.style.opacity = `0.3`;

  setTimeout(() => {
    flyImg.remove();
    cardHeader.innerHTML = +cardHeader.innerHTML + 1;
  }, speed);
}

function initCoundown(coundown) {
  coundown.forEach((coundownItem) => {
    initCountdownItem(coundownItem);
  });
}

function initCountdownItem(countdownItem) {
  const goalTime = countdownItem.dataset.countdown;

  if (goalTime) {
    const countdownItemSpans = countdownItem.querySelectorAll(
      ".countdown__digits span"
    );
    const timeGoal = Date.parse(goalTime);

    let timer = setInterval(() => {
      let timerLeft = timeGoal - Date.now();

      if (timerLeft >= 0) {
        const MSECONDS_PER_DAY = 1000 * 60 * 60 * 24;
        const MSECONDS_PER_HOUR = 1000 * 60 * 60;
        const MSECONDS_PER_MIN = 1000 * 60;
        const MSECONDS_PER_SEC = 1000;

        const days = Math.floor(timerLeft / MSECONDS_PER_DAY);
        const hours = Math.floor(
          (timerLeft % MSECONDS_PER_DAY) / MSECONDS_PER_HOUR
        );
        const minutes = Math.floor(
          (timerLeft % MSECONDS_PER_HOUR) / MSECONDS_PER_MIN
        );
        const second = Math.floor(
          (timerLeft % MSECONDS_PER_MIN) / MSECONDS_PER_SEC
        );

        countdownItemSpans[0].innerHTML = String(days).padStart(2, "0");
        countdownItemSpans[1].innerHTML = String(hours).padStart(2, "0");
        countdownItemSpans[2].innerHTML = String(minutes).padStart(2, "0");
        countdownItemSpans[3].innerHTML = String(second).padStart(2, "0");
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }
}

function sliderInit() {
  if (document.querySelector(".slider-reviews")) {
    const sliderReviews = new Swiper(".slider-reviews", {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 24,

      // Navigation arrows
      navigation: {
        nextEl: ".block-header__slider-arrow--right",
        prevEl: ".block-header__slider-arrow--left",
      },

      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10,
        },
        600: {
          slidesPerView: 1.5,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1050: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }

  if (document.querySelector(".gallery-product")) {
    const sliderThumbs = new Swiper(".thumbs-gallery__slider", {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 12,
      direction: "vertical",

      // Navigation arrows
      navigation: {
        nextEl: ".thumbs-gallery__arrow--down",
        prevEl: ".thumbs-gallery__arrow--up",
      },
    });

    const sliderMain = new Swiper(".main-gallery", {
      loop: true,
      speed: 500,
      slidesPerView: 1,
      effect: "fade",
      thumbs: {
        swiper: sliderThumbs,
      },
    });
  }
}

function priceFilterInit() {
  const priceFilterSlider = document.querySelector(".price-filter__slider");

  noUiSlider.create(priceFilterSlider, {
    start: [20, 80],
    connect: true,
    range: {
      min: 10,
      max: 1500,
    },
  });

  const priceValue = document.querySelector(".price-filter__value");
  let priceInputFrom = document.querySelector(".price-filter__from");
  let priceInputTo = document.querySelector(".price-filter__to");

  priceFilterSlider.noUiSlider.on("update", function (values, handle) {
    priceValue.innerHTML = values.join(" — ");

    priceInputFrom.value = values[0];
    priceInputTo.value = values[1];
  });
}

function indexInParent(parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
}
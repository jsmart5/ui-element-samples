'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SideNav = function () {
  function SideNav() {
    _classCallCheck(this, SideNav);

    this.showButtonEl = document.querySelector('.js-menu-show');
    this.hideButtonEl = document.querySelector('.js-menu-hide');
    this.sideNavEl = document.querySelector('.js-side-nav');
    this.sideNavContainerEl = document.querySelector('.js-side-nav-container');

    this.showSideNav = this.showSideNav.bind(this);
    this.hideSideNav = this.hideSideNav.bind(this);
    this.blockClicks = this.blockClicks.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.update = this.update.bind(this);

    this.startX = 0;
    this.currentX = 0;
    this.touchingSideNav = false;

    this.addEventListeners();
  }

  _createClass(SideNav, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      this.showButtonEl.addEventListener('click', this.showSideNav);
      this.hideButtonEl.addEventListener('click', this.hideSideNav);
      this.sideNavEl.addEventListener('click', this.hideSideNav);
      this.sideNavContainerEl.addEventListener('click', this.blockClicks);

      this.sideNavEl.addEventListener('touchstart', this.onTouchStart);
      this.sideNavEl.addEventListener('touchmove', this.onTouchMove);
      this.sideNavEl.addEventListener('touchend', this.onTouchEnd);
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(evt) {
      if (!this.sideNavEl.classList.contains('side-nav--visible')) return;

      this.startX = evt.touches[0].pageX;
      this.currentX = this.startX;

      this.touchingSideNav = true;
      requestAnimationFrame(this.update);
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(evt) {
      if (!this.touchingSideNav) return;

      this.currentX = evt.touches[0].pageX;
      var translateX = Math.min(0, this.currentX - this.startX);

      if (translateX < 0) {
        evt.preventDefault();
      }
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(evt) {
      if (!this.touchingSideNav) return;

      this.touchingSideNav = false;

      var translateX = Math.min(0, this.currentX - this.startX);
      this.sideNavContainerEl.style.transform = '';

      if (translateX < 0) {
        this.hideSideNav();
      }
    }
  }, {
    key: 'update',
    value: function update() {
      if (!this.touchingSideNav) return;

      requestAnimationFrame(this.update);

      var translateX = Math.min(0, this.currentX - this.startX);
      this.sideNavContainerEl.style.transform = 'translateX(' + translateX + 'px)';
    }
  }, {
    key: 'blockClicks',
    value: function blockClicks(evt) {
      evt.stopPropagation();
    }
  }, {
    key: 'onTransitionEnd',
    value: function onTransitionEnd(evt) {
      this.sideNavEl.classList.remove('side-nav--animatable');
      this.sideNavEl.removeEventListener('transitionend', this.onTransitionEnd);
    }
  }, {
    key: 'showSideNav',
    value: function showSideNav() {
      this.sideNavEl.classList.add('side-nav--animatable');
      this.sideNavEl.classList.add('side-nav--visible');
      this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }
  }, {
    key: 'hideSideNav',
    value: function hideSideNav() {
      this.sideNavEl.classList.add('side-nav--animatable');
      this.sideNavEl.classList.remove('side-nav--visible');
      this.sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }
  }]);

  return SideNav;
}();

new SideNav();

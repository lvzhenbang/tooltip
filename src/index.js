import defaults from '../config/defaults';
import version from '../config/version';

import inBrowser from './utils/inBrowser';

class Tooltip {
  constructor(el, opt) {
    this.$el = el;
    this.options = {
      ...defaults,
      ...opt,
    };
    this.container = this.getContainer();
    this.tooltip = null;
    this.content = this.getContent();
    this.init();
    this.version = version;
  }

  init() {
    this.setContainerStyle();
    this.genTooltip();
    this.triggerTooltip();
  }

  getContainer() {
    let tooltipContainer = null;
    if (!this.options.container) {
      tooltipContainer = document.querySelector('.tooltip_container');

      if (!tooltipContainer) {
        tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('tooltip_container');
        document.body.insertBefore(tooltipContainer, document.body.firstChild);
      }
      return tooltipContainer;
    }

    tooltipContainer = document.querySelector(this.options.container);
    if (!tooltipContainer) {
      throw new Error('this.options.container is not exist.');
    }
    return tooltipContainer;
  }

  setContainerStyle() {
    this.container.style.position = 'relative';
  }

  genTooltip(val) {
    if (!this.tooltip) {
      const tooltipEl = document.createElement('div');

      tooltipEl.classList.add('tooltip');
      tooltipEl.innerText = this.content;
      this.container.appendChild(tooltipEl);
      this.tooltip = tooltipEl;
    }

    if (val) {
      this.tooltip.innerText = val;
    }
    this.setTooltipStyle();
  }

  setTooltipStyle() {
    const position = this.calTooltipPosition();
    this.tooltip.style.top = `${position.top}px`;
    this.tooltip.style.left = `${position.left}px`;
  }

  calTooltipPosition() {
    const elRect = this.$el.getBoundingClientRect();
    const tooltipRect = {
      width: this.tooltip.offsetWidth,
      height: this.tooltip.offsetHeight,
    };
    const offset = {
      x: Math.abs(elRect.width - tooltipRect.width) / 2,
      y: Math.abs(elRect.height - tooltipRect.height) / 2,
    };

    if (this.options.placement === 'bottom') {
      return {
        top: elRect.top + window.pageYOffset + elRect.height + this.options.distance,
        left: elRect.left + window.pageXOffset + offset.x,
      };
    }

    if (this.options.placement === 'top') {
      return {
        top: elRect.top + window.pageYOffset - tooltipRect.height - this.options.distance,
        left: elRect.left + window.pageXOffset + offset.x,
      };
    }

    if (this.options.placement === 'right') {
      return {
        top: elRect.top + window.pageYOffset + offset.y,
        left: elRect.left + window.pageXOffset + elRect.width + this.options.distance,
      };
    }

    if (this.options.placement === 'left') {
      return {
        top: elRect.top + window.pageYOffset + offset.y,
        left: elRect.left + window.pageXOffset - tooltipRect.width - this.options.distance,
      };
    }

    if (this.options.placement === 'top-left') {
      return {
        top: elRect.top + window.pageYOffset - tooltipRect.height - this.options.distance,
        left: elRect.left + window.pageXOffset - tooltipRect.width - this.options.distance,
      };
    }

    if (this.options.placement === 'top-right') {
      return {
        top: elRect.top + window.pageYOffset - tooltipRect.height - this.options.distance,
        left: elRect.left + window.pageXOffset + elRect.width + this.options.distance,
      };
    }

    if (this.options.placement === 'bottom-left') {
      return {
        top: elRect.top + window.pageYOffset + elRect.height + this.options.distance,
        left: elRect.left + window.pageXOffset - tooltipRect.width - this.options.distance,
      };
    }

    if (this.options.placement === 'bottom-right') {
      return {
        top: elRect.top + window.pageYOffset + elRect.height + this.options.distance,
        left: elRect.left + window.pageXOffset + elRect.width + this.options.distance,
      };
    }

    return null;
  }

  reCalPlacement() {
    const elRect = this.$el.getBoundingClientRect();
    const tooltipRect = {
      width: this.tooltip.offsetWidth,
      height: this.tooltip.offsetHeight,
    };
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    let alignTop = true;
    let alignRight = true;
    let alignBottom = true;
    let alignLeft = true;

    if (elRect.top < this.options.distance + tooltipRect.height) {
      alignTop = false;
    }

    if (elRect.right + this.options.distance + tooltipRect.width > winWidth) {
      alignRight = false;
    }

    if (elRect.bottom + this.options.distance + tooltipRect.height > winHeight) {
      alignBottom = false;
    }

    if (elRect.left < this.options.distance + tooltipRect.width) {
      alignLeft = false;
    }

    window.console.log(alignLeft, alignRight, alignTop, alignBottom);

    // set this.options.palcement
    if (
      (!alignLeft && !alignRight && !alignTop && !alignBottom)
      || (alignLeft && alignRight && alignTop && alignBottom)) {
      return;
    }

    if (!alignTop && alignBottom) {
      this.options.placement = 'bottom';
    }

    if (!alignBottom && alignTop) {
      this.options.placement = 'top';
    }

    if (!alignLeft && alignRight) {
      this.options.placement = 'right';
    }

    if (!alignRight && alignLeft) {
      this.options.placement = 'left';
    }

    if (!alignLeft && !alignTop) {
      if (alignBottom && alignRight) this.options.placement = 'bottom-right';
    }

    if (!alignLeft && !alignBottom) {
      if (alignTop && alignRight) this.options.placement = 'top-right';
    }

    if (!alignRight && !alignTop) {
      if (alignBottom && alignLeft) this.options.placement = 'bottom-left';
    }

    if (!alignRight && !alignBottom) {
      if (alignTop && alignLeft) this.options.placement = 'top-left';
    }

    if (!alignLeft && !alignTop && !alignRight && alignBottom) {
      this.options.placement = 'bottom';
    }

    if (!alignLeft && alignTop && !alignRight && !alignBottom) {
      this.options.placement = 'top';
    }

    if (alignLeft && !alignTop && !alignRight && !alignBottom) {
      this.options.placement = 'left';
    }

    if (!alignLeft && !alignTop && alignRight && !alignBottom) {
      this.options.placement = 'right';
    }

    if (!alignLeft && !alignRight && alignBottom && alignTop) {
      this.options.placement = 'bottom';
    }

    if (alignLeft && alignRight && !alignBottom && !alignTop) {
      this.options.placement = 'right';
    }
  }

  getContent() {
    if (this.options.content) {
      this.setContent(this.options.content);
    }

    const data = this.$el.dataset;
    if (data && data.content) {
      return data.content;
    }

    return null;
  }

  setContent(val) {
    this.content = val;
    this.genTooltip(this.content);
  }

  triggerTooltip() {
    this.$el.addEventListener('mouseenter', this.showTooltip.bind(this));
    this.$el.addEventListener('mouseleave', this.hideTooltip.bind(this));
  }

  showTooltip() {
    this.tooltip.classList.add('active');
    this.reCalPlacement();
    this.genTooltip();
  }

  hideTooltip() {
    this.tooltip.classList.remove('active');
  }
}

if (inBrowser) {
  window.Tooltip = Tooltip;
  window.console.log('plugin is running browser.');
}

export default Tooltip;

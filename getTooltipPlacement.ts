  private getTooltipPlacement(): 'top' | 'bottom' | 'left' | 'right' {
    const padding = 30; // check $popover-inner-padding in the "scss/abstractsvaribles"
    let tooltipWidth = coerceNumberProperty(this.width.replace('px', ''));
    let tooltipHeight = coerceNumberProperty(this.height.replace('px', ''));
    // if either width and height is invalid, the position is bottom by default
    if (tooltipWidth <= 0 || tooltipHeight <= 0) {
      return 'bottom';
    }
    tooltipWidth = padding * 2 + tooltipWidth;
    tooltipHeight = padding * 2 + tooltipHeight;
    const tooltipBtnElem = this.tooltipBtn.nativeElement as HTMLElement;
    const box = tooltipBtnElem.getBoundingClientRect();
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const left = box.left;
    const top = box.top;
    const bottom = screenHeight - top - box.height;
    const right = screenWidth - left - box.width;

    // The default position is bottom and the left offset is always 0,
    // So we only need check wthether the right space is enough
    if (tooltipWidth - box.width > right) {
      if (tooltipWidth <= left) {
        return 'left';
      }
    }

    // check the space is enough to show tooltip at bottom
    if (tooltipHeight <= bottom) {
      return 'bottom';
    } else {
      return 'top';
    }
  }
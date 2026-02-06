// Global style manager to track rendered styles and avoid duplicates
class GlobalStyleManager {
  private renderedStyles = new Set<string>();
  private styleElement: HTMLStyleElement | null = null;

  private getStyleElement(): HTMLStyleElement {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.setAttribute('data-rgm-anchor-styles', '');
      document.head.appendChild(this.styleElement);
    }
    return this.styleElement;
  }

  addAdvancedMarkerPointerEventsOverwrite(): void {
    if (this.renderedStyles.has('marker-pointer-events')) {
      return;
    }

    const styleElement = this.getStyleElement();
    styleElement.textContent += `
      gmp-advanced-marker[data-origin='rgm'] {
        pointer-events: none !important;
      }
    `;
    this.renderedStyles.add('marker-pointer-events');
  }

  cleanup(): void {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
      this.renderedStyles.clear();
    }
  }
}

export const globalStyleManager = new GlobalStyleManager();

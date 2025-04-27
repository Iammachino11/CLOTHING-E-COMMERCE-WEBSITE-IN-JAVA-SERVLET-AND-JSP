class SmartPaginator {
  constructor(options) {
    const defaults = {
      containerSelector: '.customerReviewContainer',
      itemSelector: '.customerReviewWrapper',
      visiblePages: 5,
      itemsPerPage: 20,
      cssClasses: {
        controls: 'paginationControls',
        prev: 'pagePrev',
        next: 'pageNext',
        number: 'pageNumber',
        active: 'activePage',
        ellipsis: 'pageEllipsis'
      }
    };

    this.config = { ...defaults, ...options };
    this.currentPage = 1;
    this.totalPages = 0;
    this.isExpanded = false;
    this.init();
  }

  init() {
    this.$container = $(this.config.containerSelector);
    this.$items = this.$container.find(this.config.itemSelector);
    this.totalPages = Math.ceil(this.$items.length / this.config.itemsPerPage);

    if (this.totalPages > 1) {
      this.$items.hide();
      this.createControls();
      this.showPage(this.currentPage);
    }
  }

  createControls() {
    this.clearExistingControls();

    this.$controls = $(`<div class="${this.config.cssClasses.controls}"></div>`);
    this.createNavButton('prev', '&lt;');
    this.createPageNumbers();
    this.createNavButton('next', '&gt;');

    this.$container.after(this.$controls);
  }

  createNavButton(type, text) {
    const disabled = this[`is${type.charAt(0).toUpperCase() + type.slice(1)}Disabled`]() ? 'disabled' : '';
    const $button = $(`<button class="${this.config.cssClasses[type]} ${disabled}">${text}</button>`)
      .on('click', () => {
        if (!$button.hasClass('disabled')) {
          this.handleNavClick(type);
        }
      });
    this.$controls.append($button);
  }

  createPageNumbers() {
    const pages = this.getVisiblePages();

    pages.forEach(page => {
      if (page === '...') {
        const $ellipsis = $(`<button class="${this.config.cssClasses.ellipsis}">…</button>`)  
          .on('click', () => this.handleEllipsisClick());
        this.$controls.append($ellipsis);
      } else {
        const isActive = page === this.currentPage;
        const $number = $(`<button class="${this.config.cssClasses.number} ${isActive ? this.config.cssClasses.active : ''}">${page}</button>`)
          .on('click', () => this.handleNumberClick(page));
        this.$controls.append($number);
      }
    });
  }

  getVisiblePages() {
    if (this.isExpanded) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const range = this.config.visiblePages;
    let start = Math.max(1, this.currentPage - Math.floor(range / 2));
    let end = Math.min(this.totalPages, start + range - 1);
    start = Math.max(1, end - range + 1);

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    if (start > 1) pages.unshift(1, '...');
    if (end < this.totalPages) pages.push('...', this.totalPages);

    return pages;
  }

  handleEllipsisClick() {
    this.isExpanded = true;
    this.createControls();
  }

  handleNumberClick(page) {
    // Collapse back if currently expanded
    if (this.isExpanded) {
      this.isExpanded = false;
    }
    this.showPage(page);
  }

  handleNavClick(type) {
    this.currentPage += type === 'prev' ? -1 : 1;
    this.isExpanded = false; // reset expanded on navigation
    this.showPage(this.currentPage);
  }

  showPage(page) {
    this.currentPage = page;
    const start = (page - 1) * this.config.itemsPerPage;
    this.$items.hide().slice(start, start + this.config.itemsPerPage).show();
    this.createControls();
  }

  clearExistingControls() {
    this.$controls?.remove();
  }

  isPrevDisabled() {
    return this.currentPage === 1;
  }

  isNextDisabled() {
    return this.currentPage === this.totalPages;
  }
}

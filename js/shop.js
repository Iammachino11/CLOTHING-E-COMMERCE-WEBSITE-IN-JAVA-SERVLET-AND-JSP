const input = document.getElementById('customNumber');

function increment() {
    input.stepUp();
    validateInput();
}

function decrement() {
    input.stepDown();
    validateInput();
}

function validateInput() {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);

    if (value < min) input.value = min;
    if (value > max) input.value = max;
}

// Optional: Validate input when user types manually
input.addEventListener('input', validateInput);


$('.productDetailViewModal').hide();
function updateRatingBars() {
  // Get total reviews count (remove commas if present)
  const totalReviews = parseInt($('.totalReviewCount').text().replace(/,/g, '')) || 1;
  
  // Loop through each rating level
  $('.starRatingLevel').each(function() {
      // Get count for this specific rating
      const countElement = $(this).find('.reviewSnapshotCountPercent');
      const ratingCount = parseInt(countElement.text().replace(/,/g, '')) || 0;
      
      // Calculate percentage (avoid division by zero)
      const percentage = totalReviews > 0 
          ? (ratingCount / totalReviews * 100).toFixed(2) + '%'
          : '0%';
      
      // Update the rating level width
      $(this).find('.ratingLevel').css('--i', percentage);
  });
}

function generateStars() {
  $('.starRatingWrapper').each(function() {
    const $wrapper = $(this);
    const rating = parseInt($wrapper.find('.starRatingCount').text());
    const starCount = 5; // Always show 5 stars
    
    // Clear existing stars
    $wrapper.find('.starIcon').remove();
    
    // Create new stars
    for (let i = 0; i < starCount; i++) {
      const starClass = i < rating ? 'starIcon active' : 'starIcon';
      $wrapper.append(`
        <img src="/images/icons/star-icon.svg" 
             alt="Star" 
             class="svg ${starClass}"
        >
      `);
    }
  });
  
  // Re-run SVG replacement and color stars
  replaceSVGs();
  colorStars();
}

function colorStars() {
  $('.starRatingWrapper').each(function() {
    const rating = parseInt($(this).find('.starRatingCount').text());
    const stars = $(this).find('.starIcon');
    
    stars.removeClass('active');
    stars.slice(0, rating).addClass('active');
  });
}

// Usage
const reviewPaginator = new SmartPaginator({
  containerSelector: '.customerReviewContainer',
  itemSelector: '.customerReviewWrapper',
  itemsPerPage: 20,
  visiblePages: 5,
  cssClasses: {
    controls: 'paginationControls',
    prev: 'pagePrev',
    next: 'pageNext',
    number: 'pageNumber',
    active: 'activePage',
    ellipsis: 'pageEllipsis'
  }
});

$(document).ready(function(){
  replaceSVGs();
  generateStars();
  updateRatingBars();
  // State management
  const uiState = {isDiscountClosed: false,scrollThreshold: 50,maxScroll: 150};

  // DOM cache
  const $elements = {discountAd: $('.navDiscountAd'),closeBtn: $('#close-nav-ad'),navMenu: $('.navMenu')};

  // Close button handler
  $elements.closeBtn.on('click', () => {
      uiState.isDiscountClosed = true;
      $elements.discountAd.addClass('minimized');
  });

  // Scroll handler with requestAnimationFrame optimization
  let lastScroll = 0;
  const updateNavbarBackground = () => {
      const scrollY = window.scrollY;
      const { scrollThreshold, maxScroll } = uiState;
      
      // Calculate shadow opacity
      let opacity = Math.min(Math.max((scrollY - scrollThreshold) / 
                        (maxScroll - scrollThreshold), 0), 0.2);

      // Apply shadow styles
      $elements.navMenu.css({
          'box-shadow': scrollY > scrollThreshold ? 
              `1px 1px 10px rgba(0, 0, 0, ${opacity})` : 
              '1px 1px 10px transparent'
      });

      // Handle discount ad visibility
      if (!uiState.isDiscountClosed) {
          scrollY > scrollThreshold ? 
              $elements.discountAd.addClass('minimized') :
              $elements.discountAd.removeClass('minimized');
      }

      lastScroll = scrollY;
      requestAnimationFrame(updateNavbarBackground);
  };

  // Event listeners
  $(window).on('scroll', () => requestAnimationFrame(updateNavbarBackground));
  updateNavbarBackground();

      // Function to update fillupSpace height
  function updateAddSpaceHeight() {
      const navHeight = $('.navMenu').outerHeight(); // Includes padding/borders
      // console.log(navHeight);
      $('.fillupSpace').height(navHeight);
      // console.log($('fillupSpace').css(`height`,`${navHeight}`+`px`));

    }
    
    // Initial set
    updateAddSpaceHeight();
    
    // Modern approach: Use ResizeObserver to detect element size changes
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        updateAddSpaceHeight();
      });
      resizeObserver.observe(document.querySelector('.navMenu'));
    }
    // Fallback for older browsers
    else {
      $(window).on('resize orientationchange', updateAddSpaceHeight);
    }
  // Hide the filter modal by default
    $('.filterOptionsModal').hide();
    // Display the filter modal on click on the filter button
    $('.filterButton').on('click',()=>{
      // Display the filter modal
      $('.filterOptionsModal').fadeIn();
      // Display the filter pane/menu after a time period
      setTimeout(()=>{
        $('.filterOptions').toggleClass('maximize');
      }, 200);
    });
    // Close the filter modal and menu/pane
    $('.closeFilterMenu').on('click',()=>{
      $('.filterOptions').removeClass('maximize');
      setTimeout(()=>{
        $('.filterOptionsModal').fadeOut();
      }, 200);
    });

    $('.maximizeFooterLinks').on('click', function() {
      // Get the specific ul parent of clicked button
      const $parentList = $(this).closest('ul');
      
      // Check if the clicked list is already maximized
      const wasMaximized = $parentList.hasClass('maximized');
      
      // Remove maximized class from all lists
      $('.footerTop ul').removeClass('maximized');
      
      // Toggle the clicked list if it wasn't already maximized
      if (!wasMaximized) {
          $parentList.addClass('maximized');
      }
  });

  $('.product').on('click', function(e) {
    // Only trigger if the click didn't come from addToCartBtn/addToWishlistBtn
    if (!$(e.target).closest('.addToCartBtn, .addToWishlistBtn').length) {
      $('.productDetailViewModal').css('display','flex');
        $('.productDetailViewModal').fadeIn(300);

    }
});

  $('#close-product-detail-view-btn').on('click',()=>{
    $('.productDetailViewModal').fadeOut(300);
  });

  $('.productDetailViewOtherInfoWrapper, .productDetailViewReviewsSection').hide();
  $('.productDetailViewOtherInfoWrapper').show();
  $('#product-detail-view-more-info-tab').addClass('active');

  $('#product-detail-view-more-info-tab').on('click',()=>{
    $('.productDetailViewReviewsSection').hide();
    $('#product-details-view-reviews-tab').removeClass('active');
    $('.productDetailViewOtherInfoWrapper').show();
    $('#product-detail-view-more-info-tab').addClass('active');
  });

  $('#product-details-view-reviews-tab').on('click',()=>{
    $('.productDetailViewOtherInfoWrapper').hide();
    $('#product-detail-view-more-info-tab').removeClass('active');
    $('.productDetailViewReviewsSection').show();
    $('#product-details-view-reviews-tab').addClass('active');
  });

  function updateOriginalHeight(entries) {
    entries.forEach(entry => {
        const customerReview = entry.target;
        const customerReviewOriginalHeight = customerReview.scrollHeight;
        const $wrapper = $(customerReview).closest('.customerReviewWrapper');
        const $button = $wrapper.find('.expandCustomerReviewBtn');

        customerReview.style.setProperty('--original-height', `${customerReviewOriginalHeight}px`);
        
        // Auto-expand short reviews and hide button
        if (customerReviewOriginalHeight <= 100) {
            $button.hide();
            $(customerReview).addClass('expand'); // Add expand class
        } else {
            $button.show();
            // Only remove expand class if not user-expanded
            if (!$wrapper.data('user-expanded')) {
                $(customerReview).removeClass('expand');
            }
        }
    });
}
  // Create a ResizeObserver to monitor changes in FAQsContainer dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
        updateOriginalHeight(entries);
    });
  });

  $('.customerReview').each(function () {
    resizeObserver.observe(this);
  });

// Initialize observer for all reviews
$('.customerReview').each(function() {
  // Initial check
  const $button = $(this).closest('.customerReviewWrapper').find('.expandCustomerReviewBtn');
  if (this.scrollHeight > 100) {
      $button.show();
  } else {
      $button.hide();
  }
  
  // Observe for future changes
  resizeObserver.observe(this);
});

$('.expandCustomerReviewBtn').on('click', function() {
  const $wrapper = $(this).closest('.customerReviewWrapper');
  const $review = $wrapper.find('.customerReview');
  const $svg = $(this).find('.svg');
  const isExpanded = $review.hasClass('expand');

  // Close all other reviews first
  $('.customerReview.expand').not($review).each(function() {
      $(this).removeClass('expand')
             .closest('.customerReviewWrapper')
             .data('user-expanded', false)
             .find('.expandCustomerReviewBtn .svg')
             .css('transform', 'rotate(180deg)');
  });

  // Toggle current review
  $review.toggleClass('expand', !isExpanded);
  $svg.css('transform', isExpanded ? 'rotate(180deg)' : 'rotate(0deg)');
  $wrapper.data('user-expanded', !isExpanded);
});

  $('.productDetailViewThumbnailWrapper').on('click',()=>{
    console.log('thumbnail clicked!!');
  });
});

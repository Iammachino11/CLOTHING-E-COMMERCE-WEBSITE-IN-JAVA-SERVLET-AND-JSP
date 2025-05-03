$(document).ready(function() {
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


    const slides = [
        {
            h2: 'New Clothing, Style and Collection',
            p: 'Discover our new clothing collection designed for comfort and everyday wear. These styles are simple, classic, and perfect for any occasion.',
            image: 'images/assets/hero-bg-1.jpg'
        },
        {
            h2: 'Everyday Outfit Essentials',
            p: 'Upgrade your look with our everyday essentials. Our collection offers relaxed fits and timeless designs that are easy to mix and match.',
            image: 'images/assets/hero-bg-2.jpg'
        },
        {
            h2: 'Simple & Stylish Collection',
            p: 'Find your new favorite outfits with our simple and stylish range. Each piece is made for comfort, making your daily style easy and fun.',
            image: 'images/assets/hero-bg-3.jpg'
        }
    ].slice(0, 3); // Limit to max 3 slides

    let currentIndex = 0;
    let interval;
    const animationDuration = 300;

    // Initialize first slide content immediately
    const initialSlide = slides[0];
    $('.heroDescription h2').text(initialSlide.h2);
    $('.heroDescription p').text(initialSlide.p);
    $('.heroRight img').attr('src', initialSlide.image);

    // Initialize dots
    const $dots = $('.heroDots').empty();
    slides.forEach((_, i) => {
        $('<li class="heroDot">')
            .toggleClass('active', i === 0)
            .click(() => navigateTo(i))
            .appendTo($dots);
    });

    function navigateTo(index) {
        if (index === currentIndex || index < 0 || index >= slides.length) return;        
        
        clearInterval(interval);
        animateTransition(index);
    }

    function animateTransition(newIndex) {
        const $heroLeft = $('.heroLeft');
        const $heroRight = $('.heroRight');
        const slide = slides[newIndex];

        // Fade out current content
        $heroLeft.add($heroRight).addClass('fade-out');
        
        setTimeout(() => {
            // Update content
            $heroLeft.find('h2').text(slide.h2);
            $heroLeft.find('p').text(slide.p);
            $heroRight.find('img').attr('src', slide.image);
            
            // Update active dot
            $dots.find('.heroDot').removeClass('active')
                  .eq(newIndex).addClass('active');

            // Slide in new content
            $heroLeft.add($heroRight)
                .removeClass('fade-out')
                .addClass('slide-in');

            currentIndex = newIndex;

            // Reset animation classes after completion
            setTimeout(() => {
                $heroLeft.add($heroRight).removeClass('slide-in');
            }, animationDuration);

            // Restart interval
            interval = setInterval(nextSlide, 10000);
        }, animationDuration);
    }

    function nextSlide() {
        navigateTo((currentIndex + 1) % slides.length);
    }

    // Initial interval start
    interval = setInterval(nextSlide, 10000);



     // Define your slider content in an array
     const sliderContent = [
        {
            icon: 'images/icons/why-choose-us-icon-1.svg',
            title: 'Top Quality',
            description: 'We use the best materials and careful craftsmanship to ensure every item is made to last. Our clothes are designed to keep you comfortable and stylish for a long time.'
        },
        {
            icon: 'images/icons/why-choose-us-icon-2.svg',
            title: 'Secure Payments',
            description: 'Your safety is our priority. We use trusted payment systems to protect your personal and financial information every time you shop.'
        },
        {
            icon: 'images/icons/why-choose-us-icon-3.svg',
            title: 'Fast Delivery',
            description: 'We know you’re excited to receive your order. That’s why we process and ship your items quickly, so they arrive at your doorstep without delay.'
        },
        {
            icon: 'images/icons/why-choose-us-icon-4.svg',
            title: 'Excellent Support',
            description: 'Have questions or need help? Our customer service team is here to assist you with any concerns, ensuring a smooth shopping experience.'
        }
    ];

    const $slider = $('.scrollingOrdersSlider');
    const $sliderList = $('#orders');

    // Clear existing items
    $sliderList.empty();

    // Generate slider items dynamically
    sliderContent.forEach((item, index) => {
        const itemHtml = `
            <div class="item" style="--position:${index + 1};">
                <div class="WhyChooseUs">
                    <img src="${item.icon}" alt="${item.title} icon" class="whyChooseUsIcon">
                    <div class="WhyChooseUsInfo">
                        <h2 class="WhyChooseUsTitle">${item.title}</h2>
                        <p class="WhyChooseUsDescription">${item.description}</p>
                    </div>
                </div>
            </div>
        `;
        $sliderList.append(itemHtml);
    });

    // Update quantity variable based on actual number of items
    const itemCount = $slider.find('.item').length;
    $slider.css('--quantity', itemCount);

    // Reinitialize animations
    $slider.find('.item').each(function(index) {
        $(this).css('animation-delay', 
            `calc( (20s / ${itemCount}) * ${index} - 20s)`
        );
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
});
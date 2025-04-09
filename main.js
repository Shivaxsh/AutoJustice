/*=============== SHOW MENU ===============*/
// Toggle Menu
$(document).ready(function() {
    $('.menu-toggler').on('click', function() {
      $(this).toggleClass('open');
      $('.top-nav').toggleClass('open');
    });
  });
  
  
  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
      
      // Close the menu after scrolling
      $('.top-nav').removeClass('open');
      $('.menu-toggler').removeClass('open');
    });
  });

  document.getElementById('startButton').addEventListener('click', function () {
    const startButton = document.getElementById('startButton');
    const ctaContent = document.getElementById('ctaContent');
    const demoElements = document.querySelectorAll('.penner-equations-demo .el');
    const engineSound = new Audio('assets/sounds/car-sound.mp3');

    // Smoothly hide the "START" button
    startButton.style.transition = 'transform 1.0s ease, opacity 1.0s ease';
    startButton.style.transform = 'scale(-1)';
    startButton.style.opacity = '0';
    startButton.style.pointerEvents = 'none';

    // Play the car exhaust sound
    engineSound
        .play()
        .then(() => {
            console.log('Sound started successfully');
        })
        .catch((error) => {
            console.error('Sound playback failed:', error);
        });

    // Sync animations with the sound's rhythm
    let beatInterval = null;
    engineSound.addEventListener('play', () => {
        let beatIndex = 0;
        const beatPattern = [150, 200, 600, 350, 100];

        beatInterval = setInterval(() => {
            demoElements.forEach((el) => {
                el.style.transition = 'transform 1.1s ease';
                el.style.transform = 'scale(7.5)';
            });

            setTimeout(() => {
                demoElements.forEach((el) => {
                    el.style.transform = 'scale(1)';
                });
            }, beatPattern[beatIndex % beatPattern.length]);

            beatIndex++;
        }, 200); // Adjust interval based on sound rhythm
    });

    // Stop animation and reveal CTA when sound ends
    engineSound.addEventListener('ended', () => {
        clearInterval(beatInterval); // Stop the beat animation loop
        demoElements.forEach((el) => {
            el.style.transition = 'none';
            el.style.transform = 'scale(1)';
        });

        setTimeout(() => {
            startButton.style.display = 'none';
        }, 100);

        // Reveal the CTA section
        ctaContent.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        ctaContent.style.transform = 'translateY(0)';
        ctaContent.style.opacity = '1';
        ctaContent.style.display = 'flex';
        ctaContent.classList.add('active');
    });
});  

document.addEventListener('DOMContentLoaded', function () {
    const brandDropdown = document.getElementById('brand');
    const modelDropdown = document.getElementById('model');

    // Utility to fetch and parse JSONP
    async function fetchJSONP(url) {
        return new Promise((resolve, reject) => {
            const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
            const script = document.createElement('script');
            script.src = `${url}&callback=${callbackName}`;

            window[callbackName] = function (data) {
                delete window[callbackName];
                document.body.removeChild(script);
                resolve(data);
            };

            script.onerror = function () {
                reject(new Error(`JSONP request to ${url} failed`));
            };

            document.body.appendChild(script);
        });
    }

    // Fetch Car Brands
    async function fetchBrands() {
        try {
            const response = await fetchJSONP('https://www.carqueryapi.com/api/0.3/?cmd=getMakes');
            const brands = response.Makes;

            // Populate Brand Dropdown
            brands.forEach((brand) => {
                const option = document.createElement('option');
                option.value = brand.make_id;
                option.textContent = brand.make_display;
                brandDropdown.appendChild(option);
            });

            console.log('Brands fetched successfully');
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    }

    // Fetch Models Based on Selected Brand
    async function fetchModels(brandId) {
        try {
            const response = await fetchJSONP(`https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${brandId}`);
            const models = response.Models;

            // Clear Previous Models
            modelDropdown.innerHTML = '<option value="">Select the model</option>';

            // Populate Model Dropdown
            models.forEach((model) => {
                const option = document.createElement('option');
                option.value = model.model_name;
                option.textContent = model.model_name;
                modelDropdown.appendChild(option);
            });

            // Enable Model Dropdown
            modelDropdown.disabled = false;

            console.log('Models fetched successfully');
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    }

    // Event Listeners
    brandDropdown.addEventListener('change', function () {
        const selectedBrand = brandDropdown.value;

        if (selectedBrand) {
            fetchModels(selectedBrand);
        } else {
            modelDropdown.innerHTML = '<option value="">Select the model</option>';
            modelDropdown.disabled = true;
        }
    });

    // Initial Fetch for Brands
    fetchBrands();
});

document.getElementById('surveyForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);

    fetch(this.action, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            showSuccessMessage();
            this.reset(); // Clear the form after submission
        }
    })
    .catch(error => {
        console.error("Submission error:", error);
    });
});

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    
    successMessage.classList.remove('hidden');
    successMessage.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    successMessage.style.transform = 'translateY(0)';
    successMessage.style.opacity = '1';

    // Hide message after 3 seconds and show Start button
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(50px)';

        setTimeout(() => {
            successMessage.classList.add('hidden');
            document.getElementById('startButton').style.display = 'block';
        }, 500);
    }, 3000);
}

// Get a Quote button scroller
document.addEventListener("DOMContentLoaded", function () {
    const getQuoteBtn = document.getElementById("getQuoteBtn");
    const startBtn = document.getElementById("startButton");

    if (getQuoteBtn && startBtn) {
      getQuoteBtn.addEventListener("click", function (e) {
        e.preventDefault();
        startBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  });

// Testimonial Carousel Animation
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');
let carouselDom = document.querySelector('.carousel');
let listItemDom = document.querySelector('.carousel .list');
let thumbnailDom = document.querySelector('.carousel .thumbnail');

nextDom.onclick = function(){
    showSlider('next');
}
prevDom.onclick = function(){
    showSlider('prev');
}
let timeRunning = 3000;
let timeAutoNext = 7000;
let runTimeOut;
let runAutoRun = setTimeout(()=> {
    nextDom.click();
}, timeAutoNext);

function showSlider(type){
    let itemSlider = document.querySelectorAll('.carousel .list .item');
    let itemThumbnail = document.querySelectorAll('.carousel .thumbnail');

    if(type==='next'){
        listItemDom.appendChild(itemSlider[0]);
        thumbnailDom.appendChild(itemThumbnail[0]);
        carouselDom.classList.add('next');
    }
    else{
        let positionLastItem = itemSlider.length - 1;
        listItemDom.prepend(itemSlider[positionLastItem]);
        thumbnailDom.prepend(itemThumbnail[positionLastItem]);
        carouselDom.classList.add('prev');
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning)

    clearTimeout(runAutoRun);
    
}
  


  
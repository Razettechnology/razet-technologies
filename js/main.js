/* =========================================================
   RAZET TECHNOLOGIES
   Main JavaScript
========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {

            if (nav.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        }

    });


    /* =====================================================
       CLOSE MOBILE MENU
       WHEN LINK IS CLICKED
       ===================================================== */

    const navLinks = document.querySelectorAll(".nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    });

}


/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

const header = document.querySelector(".header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.background =
                "rgba(5, 7, 13, 0.92)";

        } else {

            header.style.background =
                "rgba(5, 7, 13, 0.75)";

        }

    });

}


/* =========================================================
   CONTACT FORM → N8N
   ========================================================= */

const contactForms = document.querySelectorAll(
    "#contactForm, #ra-contact-form"
);

contactForms.forEach(function (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        // Stop the browser from navigating to the webhook
        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        if (!submitButton) return;

        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>Sending...</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;

        // Collect form information
        const formData = new FormData(contactForm);

        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(
                "https://ability-decreased-arranged-stamp.trycloudflare.com/webhook/razet-contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },

                    body: new URLSearchParams(data)
                }
            );

            if (!response.ok) {
                throw new Error("Webhook request failed");
            }

            // Successful submission
            alert(
                "Thank you! Your project enquiry has been received. The Razet Technologies team will review it and get back to you."
            );

            // Clear the form
            contactForm.reset();

        } catch (error) {

            console.error(
                "Razet Contact Form Error:",
                error
            );

            alert(
                "Sorry, we could not send your enquiry. Please try again or contact us directly by email or WhatsApp."
            );

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML = originalButtonText;

        }

    });

});

/* =========================================================
   FAQ ACCORDION
   ========================================================= */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const currentItem = question.closest(".faq-item");

        document.querySelectorAll(".faq-item").forEach(function (item) {

            if (item !== currentItem) {
                item.classList.remove("active");
            }

        });

        currentItem.classList.toggle("active");

    });

});

/* =========================================================
   SERVICE FAQ ACCORDION
   ========================================================= */

const serviceFaqQuestions = document.querySelectorAll(
    ".service-faq-question"
);

serviceFaqQuestions.forEach(function (question) {

    question.addEventListener("click", function () {

        const currentItem = question.closest(".service-faq-item");

        document.querySelectorAll(".service-faq-item").forEach(function (item) {

            if (item !== currentItem) {
                item.classList.remove("active");
            }

        });

        currentItem.classList.toggle("active");

    });

});


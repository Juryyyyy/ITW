$(function () {
    const $nav = $("#navigation");
    const $navToggle = $("#nav-toggle");
    const navTop = $nav.offset().top;

    function getSectionTitle($section) {
        const $heading = $section.find("h2").first();

        if ($heading.length) {
            const title = $heading.text().trim();
            $heading.remove();
            return title;
        }

        const sectionId = $section.attr("id");
        const linkText = $(`#navigation a[href="#${sectionId}"]`).text().trim();
        return linkText || sectionId || "Section";
    }

    // Nahradi staticke nadpisy sekcii rozbalovacimi tlacidlami.
    function buildCollapsibleSections() {
        $("main section").each(function () {
            const $section = $(this);
            const title = getSectionTitle($section);
            const $content = $('<div class="section-content"></div>');
            const $toggle = $(`
                <button type="button" class="section-toggle" aria-expanded="false">
                    <span class="section-toggle-text"></span>
                    <span class="section-toggle-icon" aria-hidden="true">&#9662;</span>
                </button>
            `);

            $toggle.find(".section-toggle-text").text(title);
            $content.append($section.contents());
            $content.hide();

            $section
                .addClass("collapsible-section")
                .empty()
                .append($toggle, $content);
        });
    }

    function setSectionState($section, shouldOpen, callback) {
        const $content = $section.children(".section-content");
        const $toggle = $section.children(".section-toggle");

        $section.toggleClass("is-open", shouldOpen);
        $toggle.attr("aria-expanded", String(shouldOpen));

        if (shouldOpen) {
            $content.stop(true, true).slideDown(250, callback);
        } else {
            $content.stop(true, true).slideUp(250, callback);
        }
    }

    buildCollapsibleSections();

    function setNavState(shouldOpen) {
        $nav.toggleClass("open", shouldOpen);
        $navToggle.attr("aria-expanded", String(shouldOpen));
    }

    // Po prescrollovani navigacie sa z nej stane sticky menu.
    $(window).on("scroll", function () {
        if ($(window).scrollTop() >= navTop) {
            $nav.addClass("sticky");
        } else {
            $nav.removeClass("sticky");
        }
    });

    $(window).on("resize", function () {
        if (window.innerWidth > 576) {
            setNavState(false);
        }
    });

    $navToggle.on("click", function () {
        const shouldOpen = !$nav.hasClass("open");
        setNavState(shouldOpen);
    });

    $("main").on("click", ".section-toggle", function () {
        const $section = $(this).closest("section");
        const shouldOpen = !$section.hasClass("is-open");
        setSectionState($section, shouldOpen);
    });

    $("#navigation a").on("click", function (e) {
        e.preventDefault();
        const targetSelector = $(this).attr("href");
        const $target = $(targetSelector);

        if (!$target.length) {
            return;
        }

        // Po otvoreni sekcie posunie stranku tak, aby nadpis ostal viditelny.
        const scrollToTarget = function () {
            const navHeight = $nav.outerHeight() || 0;
            $("html, body").animate({
                scrollTop: $target.offset().top - navHeight - 12
            }, 600);
        };

        if ($target.hasClass("is-open")) {
            scrollToTarget();
        } else {
            setSectionState($target, true, scrollToTarget);
        }

        if (window.innerWidth < 576){
            setNavState(false);
        }
    });
});

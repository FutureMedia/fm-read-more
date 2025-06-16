document.addEventListener("DOMContentLoaded", () => {
    const CHAR_LIMIT = 300; // Still used to determine if truncation is needed at all
    const ANIMATION_DURATION = 300;
    const MAX_HEIGHT_ANIMATION_DURATION = 350;

    const contentElement = document.querySelector('.entry-content');
    const button = document.querySelector('.fm-read-more-button');

    if (!contentElement || !button) {
        if (button) button.style.display = 'none';
        return;
    }

    const fullTextHTML = contentElement.innerHTML;
    const moreText = button.dataset.moreText || 'Read More';
    const lessText = button.dataset.lessText || 'Read Less';
    let truncatedHTML = ''; // JS will still prepare a truncated version of the text
    let isAnimating = false;

    // This function still prepares the truncated text content
    function createAndStoreTruncatedHTML() {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullTextHTML;
        const textOnly = tempDiv.textContent || tempDiv.innerText || "";

        if (textOnly.length <= CHAR_LIMIT) {
            truncatedHTML = null;
            return null;
        }

        let cutOffPoint = -1;
        const sentenceEndings = ['.', '!', '?'];
        for (let i = CHAR_LIMIT; i < textOnly.length; i++) {
            if (sentenceEndings.includes(textOnly[i])) {
                if (i + 1 >= textOnly.length || textOnly[i+1] === ' ' || textOnly[i+1] === '\n') {
                    cutOffPoint = i + 1;
                    break;
                }
            }
        }

        if (cutOffPoint === -1) {
            let extendedLimit = Math.min(textOnly.length, CHAR_LIMIT + 150);
            let lastSpace = textOnly.substring(0, extendedLimit).lastIndexOf(' ');
            if (lastSpace > CHAR_LIMIT * 0.7) {
                 cutOffPoint = lastSpace > 0 ? lastSpace : CHAR_LIMIT;
            } else {
                cutOffPoint = CHAR_LIMIT;
            }
        }
        
        let truncatedText = textOnly.substring(0, cutOffPoint).trim();
        if (cutOffPoint < textOnly.length && textOnly.length > CHAR_LIMIT) {
            truncatedText += "...";
        }
        
        if (contentElement.querySelector('p')) {
             truncatedHTML = `<p>${truncatedText}</p>`;
        } else {
             truncatedHTML = truncatedText;
        }
        return truncatedHTML;
    }

    function updateContentAndButton(expand, animate = true) {
        if (isAnimating) return;
        isAnimating = true;

        contentElement.classList.add('is-fading');

        setTimeout(() => {
            if (expand) {
                contentElement.innerHTML = fullTextHTML;
                button.textContent = lessText;
                contentElement.classList.remove('is-collapsed');
                contentElement.classList.add('is-expanded');
                contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
            } else {
                if (truncatedHTML) {
                    contentElement.innerHTML = truncatedHTML;
                } else {
                    contentElement.innerHTML = fullTextHTML; // Should not happen if no truncation
                }
                button.textContent = moreText;
                contentElement.classList.remove('is-expanded');
                contentElement.classList.add('is-collapsed');
                // Clear any inline max-height so CSS (with cqw unit) takes over
                contentElement.style.maxHeight = '';
            }
            contentElement.classList.remove('is-fading');
            setTimeout(() => isAnimating = false, Math.max(ANIMATION_DURATION, MAX_HEIGHT_ANIMATION_DURATION));
        }, animate ? ANIMATION_DURATION / 2 : 0);
    }

    function setViewState(isMobile) {
        createAndStoreTruncatedHTML(); // Determine if truncation is needed based on CHAR_LIMIT

        if (isMobile && truncatedHTML !== null) { // Truncation is needed
            contentElement.classList.add('js-fm-read-more-managed');
            button.classList.add('js-fm-read-more-active');
            button.style.display = ''; // Let CSS control visibility
            updateContentAndButton(false, false); // Start collapsed
        } else { // No truncation needed (desktop or short content on mobile)
            contentElement.classList.remove('js-fm-read-more-managed', 'is-collapsed');
            contentElement.classList.add('is-expanded');
            contentElement.innerHTML = fullTextHTML;
            contentElement.style.maxHeight = ''; // Ensure no JS max-height
            button.classList.remove('js-fm-read-more-active');
            button.style.display = 'none';
        }
    }

    button.addEventListener('click', () => {
        const currentlyExpanded = contentElement.classList.contains('is-expanded');
        updateContentAndButton(!currentlyExpanded);
    });

    const mediaQuery = window.matchMedia('(max-width: 800px)');
    function handleMediaChange(e) {
        setViewState(e.matches);
    }
    mediaQuery.addEventListener('change', handleMediaChange);
    setViewState(mediaQuery.matches); // Initial check
});

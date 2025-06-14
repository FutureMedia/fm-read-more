(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function() {
        // Initialize on page load
        setupReadMoreFunctionality();
        
        // Re-initialize on window resize
        window.addEventListener('resize', function() {
            setupReadMoreFunctionality();
        });
        
        function setupReadMoreFunctionality() {
            const containers = document.querySelectorAll(".fm-read-more-container");
            
            containers.forEach(function(container) {
                const content = container.querySelector(".fm-read-more-content");
                const button = container.querySelector(".fm-read-more-button");
                
                if (!content || !button) return;
                
                // Store original text if not already stored
                if (!content.hasAttribute('data-original-text')) {
                    content.setAttribute('data-original-text', content.innerHTML);
                }
                
                const originalText = content.getAttribute('data-original-text');
                
                // Check if window width is <= 800px
                if (window.innerWidth <= 800) {
                    // Apply truncation logic if not already expanded
                    if (!content.classList.contains("expanded")) {
                        const truncatedText = truncateToSentence(originalText, 300);
                        content.innerHTML = truncatedText;
                        
                        // Only show button if there's more content
                        if (truncatedText.length < originalText.length) {
                            button.style.display = 'inline-flex';
                        } else {
                            button.style.display = 'none';
                        }
                    }
                } else {
                    // On larger screens, show full text and hide button
                    content.innerHTML = originalText;
                    content.classList.remove("expanded");
                    button.style.display = 'none';
                }
            });
        }
        
        // Function to truncate text at the end of a sentence, closest to the character limit
        function truncateToSentence(text, limit) {
            if (text.length <= limit) return text;
            
            // Look for sentence endings (.!?) within a reasonable range after the limit
            const searchRange = text.substring(0, Math.min(limit + 100, text.length));
            
            // Find all sentence endings
            const sentenceEndingMatches = [...searchRange.matchAll(/[.!?]\s/g)];
            
            if (sentenceEndingMatches.length > 0) {
                // Find the last sentence ending that's below or closest to the limit
                let bestPosition = 0;
                
                for (const match of sentenceEndingMatches) {
                    const position = match.index + 1; // Include the period/ending punctuation
                    
                    if (position <= limit) {
                        bestPosition = position;
                    } else if (bestPosition === 0) {
                        // If we haven't found any ending below the limit, use the first one after
                        bestPosition = position;
                        break;
                    } else {
                        // We already found an ending below the limit and this one is above it
                        break;
                    }
                }
                
                if (bestPosition > 0) {
                    return text.substring(0, bestPosition + 1); // +1 to include the space after sentence
                }
            }
            
            // Fallback: if no sentence endings found, just truncate at the limit
            return text.substring(0, limit);
        }
        
        // Add click event listeners to all read more buttons
        document.querySelectorAll(".fm-read-more-button").forEach(function(button) {
            button.addEventListener("click", function() {
                const container = this.closest(".fm-read-more-container");
                const content = container.querySelector(".fm-read-more-content");
                
                if (!content) return;
                
                const moreText = this.getAttribute("data-more-text");
                const lessText = this.getAttribute("data-less-text");
                const originalText = content.getAttribute('data-original-text');

                if (content.classList.contains("expanded")) {
                    if (window.innerWidth <= 800) {
                        const truncatedText = truncateToSentence(originalText, 300);
                        content.classList.remove("expanded");
                        setTimeout(function() {
                            content.innerHTML = truncatedText;
                        }, 10); // Small delay to ensure animation works
                        this.textContent = moreText;
                    }
                } else {
                    content.classList.add("expanded");
                    content.innerHTML = originalText;
                    this.textContent = lessText;
                }
            });
        });
    });
})();

<?php

/**
 * Plugin Name: FM Read More
 * Plugin URI: https://futuremedia.gr/plugins/fm-read-more
 * Description: A simple "read more" functionality for WordPress that extends text content with a button to toggle visibility of additional text.
 * Version: 1.0.0
 * Author: Future Media
 * Author URI: https://futuremedia.gr
 * License: GPL-3.0
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: fm-read-more
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define plugin constants
define('FM_READ_MORE_VERSION', '1.0.0');
define('FM_READ_MORE_PATH', plugin_dir_path(__FILE__));
define('FM_READ_MORE_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue scripts and styles
 */
function fm_read_more_enqueue_scripts() {
    wp_enqueue_style('fm-read-more', FM_READ_MORE_URL . 'assets/css/style.css', array(), FM_READ_MORE_VERSION);
    wp_enqueue_script('fm-read-more', FM_READ_MORE_URL . 'assets/js/scripts.js', array(), FM_READ_MORE_VERSION, true);
}
add_action('wp_enqueue_scripts', 'fm_read_more_enqueue_scripts');

/**
 * Add read more functionality to the_content
 */
function fm_read_more_content_filter($content) {
    // Only apply to main content in single posts/pages
    if (!is_singular() || !in_the_loop() || !is_main_query()) {
        return $content;
    }
    
    // Add the read more button
    $button = '<button class="fm-read-more-button" data-more-text="Read More" data-less-text="Read Less">Read More</button>';
    
    // Wrap the content in our container
    $output = '<div class="entry-content-container">' . $content . $button . '</div>';
    
    return $output;
}
add_filter('the_content', 'fm_read_more_content_filter');

/**
 * Shortcode for read more functionality
 */
function fm_read_more_shortcode($atts, $content = null) {
    $atts = shortcode_atts(
        array(
            'more_text' => 'Read More',
            'less_text' => 'Read Less',
        ),
        $atts,
        'fm_read_more'
    );

    $output = '<div class="fm-read-more-container">';
    $output .= '<div class="fm-read-more-content">' . do_shortcode($content) . '</div>';
    $output .= '<button class="fm-read-more-button" data-more-text="' . esc_attr($atts['more_text']) . '" data-less-text="' . esc_attr($atts['less_text']) . '">' . esc_html($atts['more_text']) . '</button>';
    $output .= '</div>';

    return $output;
}
add_shortcode('fm_read_more', 'fm_read_more_shortcode');
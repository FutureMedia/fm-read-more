# FM Read More

A simple WordPress plugin that adds "read more" functionality to your content.

## Description

FM Read More allows you to add expandable content sections to your posts and pages. Content can be collapsed initially and expanded when the user clicks the "Read More" button.

## Installation

1. Upload the `fm-read-more` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

Use the shortcode `[fm_read_more]` to add read more functionality to your content:

```
echo do_shortcode('[fm_read_more]'); 
```

### Shortcode Attributes

- `more_text`: The text displayed on the button to expand content (default: "Read More")
- `less_text`: The text displayed on the button to collapse content (default: "Read Less")

## License

This plugin is licensed under the GPL v3 or later.
# Page full

# Group Default

This is the default layout for a group content type.

## Regions

- marquee_primary_left
- marquee_primary_right
- body_header
- body_body
- body_footer

## Usage

```twig
{% set overline %}
  ...
{% endset %}

{% set marquee_primary_left %}
  ...
{% endset %}

{% set marquee_primary_right %}
  ...
{% endset %}

{% set body_header %}
  ...
{% endset %}

{% set body_body %}
  ...
{% endset %}

{% set body_footer %}
  ...
{% endset %}

{% include "@layouts/page-full/page-full.twig" with {
    marquee_primary_left: marquee_primary_left,
    marquee_primary_right: marquee_primary_right,
    body_header: body_header,
    body_body: body_body,
    body_footer: body_footer,
} only %}
```

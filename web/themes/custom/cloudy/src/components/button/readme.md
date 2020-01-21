# Button

## Props

- `text`*: string - Required text that is placed inside
- `type`: primary (default), secondary - Different types possible
- `isDark`: boolean

## Usage

```twig
{% include "@components/button/button.twig" with {
  "text": "Hello World!",
} only %}
```

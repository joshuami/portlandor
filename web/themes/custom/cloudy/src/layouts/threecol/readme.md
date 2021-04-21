# Layout threecol

## Props

- `text`*: string - Required text that is placed inside
- `type`: primary (default), secondary - Different types possible
- `isDark`: boolean

## Usage

```twig
{% include '@layouts/threecol/layout--threecol.twig' with {
  first_aside: first_aside,
  main: main,
  second_aside: second_aside
} only %}
```

# x-layers-canvas



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type           | Default     |
| ----------- | ----------- | ----------- | -------------- | ----------- |
| `data`      | `data`      |             | `any`          | `undefined` |
| `mode`      | `mode`      |             | `"2d" \| "3d"` | `undefined` |
| `wireframe` | `wireframe` |             | `boolean`      | `undefined` |
| `zoom`      | `zoom`      |             | `number`       | `undefined` |


## Dependencies

### Used by

 - [x-layers-container](../x-layers-container)

### Depends on

- [x-layers-page](../x-layers-page)

### Graph
```mermaid
graph TD;
  x-layers-canvas --> x-layers-page
  x-layers-page --> x-layers-layer
  x-layers-layer --> x-layers-layer
  x-layers-container --> x-layers-canvas
  style x-layers-canvas fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

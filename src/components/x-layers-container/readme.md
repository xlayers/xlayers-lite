# x-layers-container



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

 - [x-layers](../x-layers)

### Depends on

- [x-layers-canvas](../x-layers-canvas)

### Graph
```mermaid
graph TD;
  x-layers-container --> x-layers-canvas
  x-layers-canvas --> x-layers-page
  x-layers-page --> x-layers-layer
  x-layers-layer --> x-layers-layer
  x-layers --> x-layers-container
  style x-layers-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

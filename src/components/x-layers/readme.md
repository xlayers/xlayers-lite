# x-layers



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type           | Default     |
| ----------- | ----------- | ----------- | -------------- | ----------- |
| `mode`      | `mode`      |             | `"2d" \| "3d"` | `"2d"`      |
| `src`       | `src`       |             | `string`       | `undefined` |
| `wireframe` | `wireframe` |             | `boolean`      | `false`     |
| `zoom`      | `zoom`      |             | `number`       | `1`         |


## Dependencies

### Depends on

- [x-layers-upload](../x-layers-upload)
- [x-layers-container](../x-layers-container)

### Graph
```mermaid
graph TD;
  x-layers --> x-layers-upload
  x-layers --> x-layers-container
  x-layers-container --> x-layers-canvas
  x-layers-canvas --> x-layers-page
  x-layers-page --> x-layers-layer
  x-layers-layer --> x-layers-layer
  style x-layers fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

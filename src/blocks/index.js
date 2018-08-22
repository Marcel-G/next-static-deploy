import React from 'react'
import { omit } from 'ramda'
import dynamic from 'next/dynamic'

export const getComponentDisplayName = Component =>
  Component.displayName || Component.name || 'Component'

const Loading = () => null

const dynamicImportOptions = {
  loading: Loading
}

const mapping = {
  contentAreaBlock: dynamic(import('./contentAreaBlock'), dynamicImportOptions)
}

export const getBlocks = (modules = [], props = {}) =>
  modules
    .map(module => {
      if (module.sys.type === 'Link') {
        return (
          <div>Unresolved link ({module.sys.id})</div>
        )
      }

      const contentType = module.sys.contentType.sys.id
      const Component = mapping[contentType] ? mapping[contentType] : null
      if (!Component) {
        return null
      }

      return (
        <Component
          key={module.sys.id}
          id={module.sys.id}
          {...module.fields}
          {...props} />
      )
    })

export const withChildComponents = (blockArrayName = 'blocks') => Wrapped => {
  const _withChildComponents = props => ( /* eslint-disable-line */
    <Wrapped {...omit([blockArrayName], props)}>
      {getBlocks(props[blockArrayName])}
    </Wrapped>
  )

  _withChildComponents.displayName = `withChildComponents(${getComponentDisplayName(Wrapped)})`

  return _withChildComponents
}

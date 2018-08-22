import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { Link } from '$/routes'

const RenderLink = ({ href, ...props }) => {
  if (href.indexOf('~') === 0) {
    return (
      <Link route={href.split('~')[1]} href={href.split('~')[1]}>
        <a {...props} href={href.split('~')[1]}>{props.children}</a>
      </Link>
    )
  }
  return (<a {...props}>{props.children}</a>)
}

RenderLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired
}

RenderLink.defaultProps = {
  children: null
}

const ContentAreaBlock = ({
  content,
  textAlign
}) => (
  <div style={{ textAlign: textAlign.toLowerCase() }}>
    <ReactMarkdown
      renderers={{
          link: RenderLink
        }}
      unwrapDisallowed
      allowedTypes={[
          'blockquote',
          'heading',
          'paragraph',
          'link',
          'list',
          'image',
          'listItem',
          'thematicBreak',
          'emphasis',
          'strong',
          'break'
        ]}
      source={content} />
  </div>
)

const textAlignOptions = ['Left', 'Right', 'Center']

ContentAreaBlock.propTypes = {
  content: PropTypes.string.isRequired,
  textAlign: PropTypes.oneOf([...textAlignOptions, ...textAlignOptions.map(s => s.toLowerCase())])
}

ContentAreaBlock.defaultProps = {
  textAlign: 'Left'
}

export default ContentAreaBlock

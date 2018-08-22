import styled from 'styled-components'
import { get } from '$/lib/style-utils'

const ContentArea = styled.div`
  color: ${get('theme.text.fg')};
  font-weight: 200;
  line-height: 1.5;

  & blockquote {
    margin: 1em;
    font-size: 130%;
  }

  & p {
    font-size: 100%;
  }

  & hr {
    border-color: currentColor;
    border-width: 1px 0 0 0;
    border-style: solid;
    opacity: 0.5;
    width: 10%;
  }
`

export default ContentArea

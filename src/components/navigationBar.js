import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from '$/routes'
import { withRouter } from 'next/router'

const NavLink = styled.a`
  display: block;
  padding: 1em;
  cursor: pointer;
  text-decoration: ${props => (props.isActive ? 'underline' : 'none')};
`

const Navigation = styled.div`
  margin: 1em 0;
  display: flex;
  align-items: row;
  justify-content: space-evenly;
`

const clearTrailingSlash = url =>
  url.replace(/\/$/, '') || '/'


const NavigationBar = ({ navigation = [], router }) => (
  <Navigation>
    {navigation.length && navigation.map(item => (
      <div key={item.route}>
        <Link href={item.route} route={item.route}>
          <NavLink
            isActive={clearTrailingSlash(router.asPath) === item.route} >
            {item.label}
          </NavLink>
        </Link>
      </div>)
    )}
  </Navigation>
)

NavigationBar.propTypes = {
  navigation: PropTypes.arrayOf(PropTypes.object),
  router: PropTypes.object, /* eslint-disable-line */
}

NavigationBar.defaultProps = {
  navigation: []
}

export default withRouter(NavigationBar)

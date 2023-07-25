import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {RiCloseCircleFill} from 'react-icons/ri'
import './index.css'

class Header extends Component {
  state = {
    isExpanded: false,
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickExpand = () => {
    this.setState(prevState => ({isExpanded: !prevState.isExpanded}))
  }

  onClickCross = () => {
    this.setState({isExpanded: false})
  }

  renderMobileViewNavItems = () => {
    const {home, shelves} = this.props
    const activeHome = home ? 'active-tab' : ''
    const activeShelves = shelves ? 'active-tab' : ''
    return (
      <div className="mobile-view-nav-items">
        <Link className="mobile-view-nav-item-link" to="/">
          <h1 className={`mobile-view-shelf ${activeHome}`}>Home</h1>
        </Link>
        <Link className="mobile-view-nav-item-link" to="/shelf">
          <h1 className={`mobile-view-shelf ${activeShelves}`}>Bookshelves</h1>
        </Link>
        <button
          onClick={this.onClickLogout}
          type="button"
          className="logout-button"
        >
          Logout
        </button>
        <button
          onClick={this.onClickCross}
          className="cross-icon-btn"
          type="button"
        >
          <RiCloseCircleFill className="cross-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {isExpanded} = this.state
    const {home, shelves} = this.props
    const activeHome = home ? 'active-tab' : ''
    const activeShelves = shelves ? 'active-tab' : ''
    return (
      <>
        <nav className="navbar-container">
          <Link to="/" className="navbar-company-logo-name">
            <img
              src="https://res.cloudinary.com/dr8jg61z3/image/upload/v1690131958/Bookshub/Group_7730_wnv7dg.png"
              alt="website logo"
              className="navbar-company-logo"
            />
            <p className="navbar-company-name">ook Hub</p>
          </Link>
          <button
            onClick={this.onClickExpand}
            type="button"
            className="nav-items-icon"
          >
            <GiHamburgerMenu />
          </button>
          <div className="nav-items-logout-container">
            <ul className="nav-items-container">
              <li className="nav-item">
                <Link className={`nav-item-link ${activeHome}`} to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-item-link ${activeShelves}`} to="/shelf">
                  Bookshelves
                </Link>
              </li>
            </ul>
            <button
              onClick={this.onClickLogout}
              type="button"
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </nav>
        {isExpanded && this.renderMobileViewNavItems()}
      </>
    )
  }
}

export default withRouter(Header)

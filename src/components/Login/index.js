import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.status === 200) {
      const jwtToken = data.jwt_token
      const {history} = this.props
      console.log(jwtToken)
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    } else {
      this.setState({errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-app-container">
        <img
          src="https://res.cloudinary.com/dr8jg61z3/image/upload/v1690131960/Bookshub/Rectangle_1467_gvfahs.png"
          alt="website login"
          className="login-page-image"
        />
        <form onSubmit={this.onClickLogin} className="login-form-container">
          <div className="login-company-logo-name">
            <img
              src="https://res.cloudinary.com/dr8jg61z3/image/upload/v1690131958/Bookshub/Group_7730_wnv7dg.png"
              alt="login website logo"
              className="login-company-logo"
            />
            <p className="login-company-name">ook Hub</p>
          </div>

          <label className="login-label-name">
            Username*{' '}
            <input
              onChange={this.onChangeUsername}
              type="text"
              className="login-input-text"
              value={username}
            />
          </label>
          <label className="login-label-name">
            Password*{' '}
            <input
              onChange={this.onChangePassword}
              type="password"
              className="login-input-text"
              value={password}
            />
          </label>
          {errorMsg.length > 0 && <p className="login-error-msg">{errorMsg}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login

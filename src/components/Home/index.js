import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Header from '../Header'
import Footer from '../Footer'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const initialApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    topRatedBooks: [],
    apiStatus: initialApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      this.setState({
        apiStatus: initialApiStatusConstants.inProgress,
      })
      const url = 'https://apis.ccbp.in/book-hub/top-rated-books'
      const options = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.status === 200) {
        const data = await response.json()
        const updatedData = data.books.map(each => ({
          id: each.id,
          title: each.title,
          authorName: each.author_name,
          coverPic: each.cover_pic,
        }))
        this.setState({
          topRatedBooks: updatedData,
          apiStatus: initialApiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: initialApiStatusConstants.failure})
      }
    }
  }

  renderSlider = () => {
    const {topRatedBooks} = this.state

    return (
      <Slider {...settings}>
        {topRatedBooks.map(each => {
          const {id, title, authorName, coverPic} = each

          const bookLink = `/books/${id}`

          return (
            <ul>
              <li className="slick-item" key={id}>
                <Link className="slick-item-link" to={bookLink}>
                  <img className="slick-cover-pic" src={coverPic} alt={title} />
                  <h1 className="slick-item-title">{title}</h1>
                  <p className="slick-item-author">{authorName}</p>
                </Link>
              </li>
            </ul>
          )
        })}
      </Slider>
    )
  }

  onClickFindBooks = () => {
    const {history} = this.props
    history.push('/shelf')
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.getTopRatedBooks()
  }

  renderFailureView = () => (
    <div className="home-failure-view-container">
      <img
        src="https://res.cloudinary.com/dr8jg61z3/image/upload/v1690213007/Bookshub/Group_7522_ncefnn.png"
        alt="failure view"
        className="home-failure-view-image"
      />
      <p className="home-failure-view-description">
        Something went wrong, Please try again.
      </p>
      <button
        onClick={this.onClickTryAgain}
        type="button"
        className="home-failure-view-retry-button"
      >
        Try Again
      </button>
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialApiStatusConstants.inProgress:
        return this.renderLoader()
      case initialApiStatusConstants.success:
        return <div className="slick-container">{this.renderSlider()}</div>
      case initialApiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header home />
        <div className="home-app-container">
          <div className="home-content-slick-container">
            <div className="home-content-container">
              <h1 className="home-content-heading">
                Find Your Next Favorite Books?
              </h1>
              <p className="home-content-description">
                You are in the right place. Tell us what titles or genres you
                have enjoyed in the past, and we will give you surprisingly
                insightful recommendations.
              </p>
              <button
                onClick={this.onClickFindBooks}
                type="button"
                className="home-content-find-books-button"
              >
                Find Books
              </button>
            </div>
            <div className="home-slick-container">
              <div className="home-slick-heading-button-container">
                <h1 className="home-slick-heading">Top Rated Books</h1>
                <button
                  onClick={this.onClickFindBooks}
                  type="button"
                  className="home-slick-find-books-button"
                >
                  Find Books
                </button>
              </div>
              {this.renderApiStatus()}
            </div>
          </div>

          <Footer className="footer-position" />
        </div>
      </>
    )
  }
}
export default Home

import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import Footer from '../Footer'

const initialApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class BookDetails extends Component {
  state = {bookDetails: [], apiStatus: initialApiStatusConstants.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({
      apiStatus: initialApiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const url = `https://apis.ccbp.in/book-hub/books/${id}`
      const options = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
      const response = await fetch(url, options)
      if (response.status === 200) {
        const data = await response.json()
        const updatedData = data.book_details
        const bookDetails = {
          id: updatedData.id,
          authorName: updatedData.author_name,
          coverPic: updatedData.cover_pic,
          aboutBook: updatedData.about_book,
          rating: updatedData.rating,
          readStatus: updatedData.read_status,
          title: updatedData.title,
          aboutAuthor: updatedData.about_author,
        }
        this.setState({
          bookDetails,
          apiStatus: initialApiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: initialApiStatusConstants.failure})
      }
    } else {
      this.setState({apiStatus: initialApiStatusConstants.failure})
    }
  }

  onClickTryAgain = () => {
    this.getBookDetails()
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

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialApiStatusConstants.inProgress:
        return this.renderLoader()
      case initialApiStatusConstants.success:
        return this.renderBookDetails()
      case initialApiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderBookDetails = () => {
    const {bookDetails} = this.state
    const {
      title,
      authorName,
      coverPic,
      rating,
      readStatus,
      aboutAuthor,
      aboutBook,
    } = bookDetails
    return (
      <div className="book-details-app-container">
        <div className="book-details-container">
          <div className="book-details-image-content-container">
            <img src={coverPic} alt={title} className="book-details-image" />
            <div className="book-details-content-container">
              <h1 className="book-details-title">{title}</h1>
              <p className="book-details-author">{authorName}</p>
              <p className="book-details-rating-container">
                Avg Rating{' '}
                <BsFillStarFill className="book-details-rating-icon" />{' '}
                <p className="book-details-rating">{rating}</p>
              </p>
              <p className="book-details-read-status-container">
                Status :{' '}
                <p className="book-details-read-status">{readStatus}</p>
              </p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="book-details-about-container">
            <h1 className="book-details-about-heading">About Author</h1>
            <p className="book-details-about-description">{aboutAuthor}</p>
            <h1 className="book-details-about-heading">About Book</h1>
            <p className="book-details-about-description">{aboutBook}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        {this.renderApiStatus()}
      </>
    )
  }
}
export default BookDetails

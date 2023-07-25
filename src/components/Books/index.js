import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import Header from '../Header'
import Bookshelves from '../Bookshelves'
import Footer from '../Footer'
import BookItem from '../BookItem'
import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const initialApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Books extends Component {
  state = {
    activeTab: bookshelvesList[0].value,
    activeTablabel: bookshelvesList[0].label,
    booksList: [],
    apiStatus: initialApiStatusConstants.initial,
    pageStatus: initialApiStatusConstants.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getAllBooks()
  }

  getAllBooks = async () => {
    this.setState({
      apiStatus: initialApiStatusConstants.inProgress,
      pageStatus: initialApiStatusConstants.inProgress,
    })
    const {activeTab, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      this.setState({pageStatus: initialApiStatusConstants.success})
      const url = `https://apis.ccbp.in/book-hub/books?shelf=${activeTab}&search=${searchInput}`
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
          authorName: each.author_name,
          coverPic: each.cover_pic,
          id: each.id,
          rating: each.rating,
          readStatus: each.read_status,
          title: each.title,
        }))
        this.setState({
          booksList: updatedData,
          apiStatus: initialApiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: initialApiStatusConstants.failure})
      }
    } else {
      this.setState({pageStatus: initialApiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getAllBooks)
  }

  onKeyDownSearchText = event => {
    if (event.key === 'Enter') {
      this.getBookList()
    }
  }

  onClickSearch = () => {
    this.getAllBooks()
  }

  changeActiveTab = (value, label) => {
    this.setState({activeTab: value, activeTablabel: label}, this.getAllBooks)
  }

  onClickTryAgain = () => {
    this.getAllBooks()
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
        return this.renderAllBooksList()
      case initialApiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderAllBooksList = () => {
    const {booksList, searchInput} = this.state
    return (
      <>
        {booksList.length === 0 ? (
          <div className="books-no-result-container">
            <img
              src="https://res.cloudinary.com/dr8jg61z3/image/upload/v1690230295/Bookshub/Asset_1_1_ovnalu.png"
              alt="no books"
              className="books-no-result-image"
            />
            <p className="books-no-result-heading">
              Your search for {searchInput} did not find any matches.
            </p>
          </div>
        ) : (
          <ul className="books-list-container">
            {booksList.map(each => (
              <BookItem key={each.id} bookDetails={each} />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderBooksPage = () => {
    const {activeTab, activeTablabel, searchInput} = this.state
    return (
      <div className="books-app-container">
        <div className="books-mobile-search-container">
          <input
            onChange={this.onChangeSearchInput}
            className="search-input"
            type="search"
            placeholder="Search"
            value={searchInput}
            onKeyDown={this.onKeyDownSearchText}
          />
          <button
            onClick={this.onClickSearch}
            type="button"
            className="search-button"
            testid="searchButton"
            value={searchInput}
          >
            <BsSearch />
          </button>
        </div>
        <div className="books-left-navbar-container">
          <h1 className="books-left-navbar-heading">Bookshelves</h1>
          <ul className="books-shelves-list-container">
            {bookshelvesList.map(each => (
              <Bookshelves
                key={each.id}
                activeTab={activeTab}
                bookShelves={each}
                changeActiveTab={this.changeActiveTab}
              />
            ))}
          </ul>
        </div>

        <div className="books-lists-container">
          <div className="books-heading-search-container">
            <h1 className="books-all-heading">{activeTablabel} Books</h1>
            <div className="books-search-container">
              <input
                onChange={this.onChangeSearchInput}
                className="search-input"
                type="search"
                placeholder="Search"
                value={searchInput}
              />
              <button
                onClick={this.onClickSearch}
                type="button"
                className="search-button"
              >
                <BsSearch />
              </button>
            </div>
          </div>

          {this.renderApiStatus()}

          <Footer className="footer-position" />
        </div>
      </div>
    )
  }

  renderPageStatus = () => {
    const {pageStatus} = this.state
    switch (pageStatus) {
      case initialApiStatusConstants.inProgress:
        return this.renderLoader()
      case initialApiStatusConstants.success:
        return this.renderBooksPage()
      case initialApiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header shelves />
        {this.renderPageStatus()}
      </>
    )
  }
}
export default Books

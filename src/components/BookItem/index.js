import {Link} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'

const BookItem = props => {
  const {bookDetails} = props
  const {authorName, coverPic, rating, readStatus, title, id} = bookDetails
  const bookPath = `/books/${id}`
  return (
    <li testid="bookItem" className="book-item-container">
      <Link className="book-item-link" to={bookPath}>
        <img src={coverPic} alt={title} className="book-item-image" />
        <div className="book-item-content-container">
          <h1 className="book-item-title">{title}</h1>
          <p className="book-item-author">{authorName}</p>
          <p className="book-item-rating-container">
            Avg Rating <BsFillStarFill className="book-item-rating-icon" />{' '}
            <p className="book-item-rating">{rating}</p>
          </p>
          <p className="book-item-read-status-container">
            Status : <p className="book-item-read-status">{readStatus}</p>
          </p>
        </div>
      </Link>
    </li>
  )
}
export default BookItem

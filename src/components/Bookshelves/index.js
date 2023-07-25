import './index.css'

const Bookshelves = props => {
  const {bookShelves, activeTab, changeActiveTab} = props
  const {label, value} = bookShelves
  const activeTabClass =
    activeTab === value ? 'bookshelves-active' : 'bookshelves-item'
  console.log(activeTabClass)
  const onClickChangeActiveTab = () => {
    changeActiveTab(value, label)
  }
  return (
    <li onClick={onClickChangeActiveTab} className="bookshelves-item-label">
      <button type="button" className={activeTabClass}>
        {label}
      </button>
    </li>
  )
}
export default Bookshelves

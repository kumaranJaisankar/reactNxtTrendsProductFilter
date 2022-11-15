import {BiSearch} from 'react-icons/bi'
import './index.css'

const FiltersGroup = props => {
  const {
    userSearchFunction,
    categoryOptions,
    ratingsList,
    categoryFunction,
    ratingFunction,
    clearFunction,
    state,
  } = props
  const {category, rating} = state

  const userSearchProduct = event => {
    userSearchFunction(event.target.value)
  }

  const clearBtn = () => {
    clearFunction()
  }

  const eachCategory = each => {
    const {categoryId, name} = each
    const categoryBtn = () => {
      categoryFunction(categoryId)
    }
    const btnStyle = categoryId === category ? 'btn-style' : ''

    return (
      <li key={categoryId}>
        <p className={`category-btn ${btnStyle}`} onClick={categoryBtn}>
          {name}
        </p>
      </li>
    )
  }

  const eachRating = each => {
    const {ratingId, imageUrl} = each
    const ratingBtn = () => {
      ratingFunction(ratingId)
    }
    const btnStyle = ratingId === rating ? 'btn-style' : ''
    return (
      <li key={ratingId}>
        <button
          type="button"
          className={`category-btn ${btnStyle}`}
          onClick={ratingBtn}
        >
          <img
            src={imageUrl}
            alt={`rating ${ratingId}`}
            className="rating-size"
          />
          &up
        </button>
      </li>
    )
  }

  return (
    <div className="filters-group-container">
      <div className="search">
        <input
          type="search"
          className="input-search"
          placeholder="Search"
          onChange={userSearchProduct}
        />
        <BiSearch />
      </div>
      <h1 className="catagory">Category</h1>
      <ul className="un-order-list">
        {categoryOptions.map(each => eachCategory(each))}
      </ul>
      <h1 className="catagory">Rating</h1>
      <ul className="un-order-list">
        {ratingsList.map(each => eachRating(each))}
      </ul>
      <button type="button" className="clear-btn" onClick={clearBtn}>
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup

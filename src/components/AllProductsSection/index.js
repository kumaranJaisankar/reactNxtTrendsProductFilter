import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    userSearch: '',
    category: '',
    rating: '',
    lengthStr: true,
    error: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  categoryFunction = categoryId => {
    this.setState({category: categoryId}, this.getProducts)
  }

  clearFunction = () => {
    this.setState(
      {
        isLoading: false,
        activeOptionId: sortbyOptions[0].optionId,
        userSearch: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  ratingFunction = ratingId => {
    this.setState({rating: ratingId}, this.getProducts)
  }

  getProducts = async () => {
    try {
      this.setState({
        isLoading: true,
      })
      const jwtToken = Cookies.get('jwt_token')

      // TODO: Update the code to get products with filters applied

      const {activeOptionId, category, rating, userSearch} = this.state
      const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${userSearch.toLowerCase()}&rating=${rating}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        if (updatedData.length > 0) {
          this.setState({
            productsList: updatedData,
            isLoading: false,
            error: false,
            lengthStr: true,
          })
        } else {
          this.setState({
            productsList: updatedData,
            isLoading: false,
            error: false,
            lengthStr: false,
          })
        }
      }
    } catch (e) {
      this.setState({error: true})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  userSearchFunction = words => {
    this.setState({userSearch: words}, this.getProducts)
  }

  noProductView = () => (
    <div className="product">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-product"
      />
      <h1 className="head">No Products Found</h1>
      <p className="para">We could not find any products, Try other filters</p>
    </div>
  )

  productFailuer = () => (
    <div className="product">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="no-product"
      />
      <h1 className="head">No Products Found</h1>
      <p className="para">We could not find any products, Try other filters</p>
    </div>
  )

  productView = (productsList, activeOptionId) => (
    <>
      <ProductsHeader
        activeOptionId={activeOptionId}
        sortbyOptions={sortbyOptions}
        changeSortby={this.changeSortby}
      />
      <ul className="products-list">
        {productsList.map(product => (
          <ProductCard productData={product} key={product.id} />
        ))}
      </ul>
    </>
  )

  failOrPassVier = (lengthStr, productsList, activeOptionId) => (
    <>
      {lengthStr
        ? this.productView(productsList, activeOptionId)
        : this.noProductView()}
    </>
  )

  renderProductsList = () => {
    const {
      productsList,
      activeOptionId,
      userSearch,
      error,
      lengthStr,
    } = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        {error
          ? this.productFailuer()
          : this.failOrPassVier(lengthStr, productsList, activeOptionId)}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          categoryFunction={this.categoryFunction}
          userSearchFunction={this.userSearchFunction}
          state={this.state}
          ratingFunction={this.ratingFunction}
          clearFunction={this.clearFunction}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection

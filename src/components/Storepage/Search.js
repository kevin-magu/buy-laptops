import React from 'react'

function Search() {
  return (
    <div className='search-container'>
        <input type="search" /> 
        <select className="filter">
          <option value="" disabled selected>Filter by:</option>
          <option value="Lenovo" key="">Lenovo</option>
          <option value="HP" key="">HP</option>
          <option value="Mac" key="">Mac</option>
          <option value="Microsoft" key="">Microsoft</option>
        </select>
        <button>Search</button>
    </div>
  )
}

export default Search
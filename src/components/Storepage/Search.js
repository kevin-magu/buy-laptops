import React from 'react'

function Search() {
  return (
    <div className='search-container'>
        <input type="search" /> 
        <select className="filter">
          <option value="" disabled defaultValue="Filter by:"></option>
          <option value="Lenovo" >Lenovo</option>
          <option value="HP" >HP</option>
          <option value="Mac" >Mac</option>
          <option value="Microsoft">Microsoft</option>
        </select>
        <button>Search</button>
    </div>
  )
}

export default Search
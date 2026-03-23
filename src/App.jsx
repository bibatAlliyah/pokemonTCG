import { useState } from 'react'
import { useGetCardsQuery } from './api/pokemonApi'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  const { data, error, isLoading } = useGetCardsQuery({
    name: search,
    type: type,
    page: page,
  })

  const handleSearch = () => {
    setPage(1)
    setSearch(inputValue)
  }

  const handleTypeChange = (value) => {
  setPage(1)
  setType(value)
  }

  const pokemonTypes = [
    'Fire', 'Water', 'Grass', 'Electric', 'Psychic',
    'Fighting', 'Darkness', 'Metal', 'Fairy',
    'Dragon', 'Colorless'
  ]

  const Pagination = () => (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1 || isLoading}
      >
        Previous
      </button>

      <span style={{ margin: '0 10px' }}>Page {page}</span>

      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!data || data.data.length < 20 || isLoading}
      >
        Next
      </button>
    </div>
    )

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pokemon TCG Viewer</h1>

      {/*SEARCH*/}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
        />

        <button onClick={handleSearch}>Search</button>
      </div>
      
      {/*FILTER*/}
      <div style={{ marginBottom: '20px' }}>
        <select onChange={(e) => handleTypeChange(e.target.value)}>
          <option value="">All Types</option>
          {pokemonTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      
      <Pagination />

      {/*LOADING SCREEN*/}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {isLoading && <p>Loading Pokémon Cards...</p>}
      </div>

      {/*CARD*/}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px'
      }}>

        {data?.data?.map((card) => (
          <div 
            key={card.id} 
            style={{
              textAlign: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={card.images.small}
              alt={card.name}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            />
            <p>{card.name}</p>
          </div>
        ))}
      </div>

      <Pagination />
    </div>
  )
}

export default App
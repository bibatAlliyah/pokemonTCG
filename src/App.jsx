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
    <div style={{margin: '20px 0', textAlign: 'center'}}>
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1 || isLoading}
        style={{
          padding: '8px',
          margin: '0 5px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Previous
      </button>

      <span style={{margin: '0 10px'}}>Page {page}</span>

      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!data || data.data.length < 20 || isLoading}

        style={{
          padding: '8px',
          margin: '0 5px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Next
      </button>
    </div>
    )

  return (
    <div style={{
        padding: '20px',
        backgroundColor: '#121212',
        color: '#ffffff',
        minHeight: '100vh'
      }}>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Pokémon TCG Viewer
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {/*SEARCH*/}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          
          style={{
            padding: '8px',
            marginRight: '10px',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #444'
          }}
          />

          <button onClick={handleSearch}>Search</button>
        </div>
        
        {/*FILTER*/}
        <div 
        style={{
          marginBottom: '20px',
          padding: '8px',
          backgroundColor: '#1e1e1e',
          color: '#fff',
          border: '1px solid #444'
        }}
        >
          <select onChange={(e) => handleTypeChange(e.target.value)}>
            <option value="">All Types</option>
            {pokemonTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
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
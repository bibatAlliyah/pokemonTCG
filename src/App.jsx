import { useState } from 'react'
import { useGetCardsQuery } from './api/pokemonApi'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const { data, error, isLoading } = useGetCardsQuery({
    name: search,
    type: type,
  })

  const handleSearch = () => {
    setSearch(inputValue)
  }

  const pokemonTypes = [
    'Fire', 'Water', 'Grass', 'Electric', 'Psychic',
    'Fighting', 'Darkness', 'Metal', 'Fairy',
    'Dragon', 'Colorless'
  ]

  /*loading screen*/
      if(isLoading){
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
          }}>
            <div className="spinner"></div>
            <p>Loading Pokémon cards...</p>
          </div>
        )
      }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pokemon TCG Viewer</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {pokemonTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/*Card*/}
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
    </div>
  )
}

export default App
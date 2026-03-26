import { useState, useRef } from 'react'
import { useGetCardsQuery } from './api/pokemonApi'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCard, setSelectedCard] = useState(null)
  const audioRef = useRef(null)
  const [volume, setVolume] = useState(0.3)
  const [hasPlayed, setHasPlayed] = useState(false)

  const { data, error, isLoading, isFetching } = useGetCardsQuery({
    name: search,
    type: type,
    page: page,
  })

  const handleSearch = () => {
    setPage(1)
    setSearch(inputValue)
  }

  const playMusic = () => {
  if (audioRef.current && !hasPlayed) {
    audioRef.current.volume = volume
    audioRef.current.play().catch(() => {
      console.log('Autoplay blocked')
    })
    setHasPlayed(true)
  }
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
        disabled={page === 1 || isLoading || isFetching}
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
        disabled={!data || data.data.length < 20 || isLoading || isFetching}

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
    <div 
      onClick={playMusic}
      style={{
        padding: '20px',
        backgroundColor: '#121212',
        color: '#ffffff',
        minHeight: '100vh'
      }}>

      <h1 
      style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: "'Press Start 2P', sans-serif",
      }}>
        Pokémon TCG Viewer
      </h1>

      {/*BGM*/}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={playMusic}
          style={{
            padding: '8px',
            marginRight: '10px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ▶ Play BGM
        </button>

        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !audioRef.current.muted
            }
          }}
          style={{
            padding: '8px',
            marginRight: '10px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🔇 Mute
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const newVolume = Number(e.target.value)
            setVolume(newVolume)
            if (audioRef.current) {
              audioRef.current.volume = newVolume
            }
          }}
        />
      </div>

      <audio ref={audioRef} loop>
        <source src="/bgm.mp3" type="audio/mpeg" />
      </audio>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>

        {/*SEARCH*/}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
        >
          
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}

          style={{
            padding: '8px',
            marginRight: '10px',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #444'
          }}
          />

          <button 
          onClick={handleSearch}
          style={{
            padding: '8px',
            marginRight: '10px',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #444'
          }}
          >
            Search
          </button>
        </form>
        
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
          <select
            onChange={(e) => handleTypeChange(e.target.value)}
            style={{
              padding: '8px',
              backgroundColor: '#1e1e1e',
              color: '#fff',
              border: '1px solid #444'
            }}
          >
            <option value="">All Types</option>
            {pokemonTypes.map((t) => (
              <option 
              key={t}
              value={t}
              style={{ backgroundColor: '#1e1e1e', color: '#fff' }}
              >
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Pagination />

      {/*LOADING SCREEN*/}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {(isLoading || isFetching) && <p>Loading Pokémon Cards...</p>}
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
            onClick={() => setSelectedCard(card)}
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
      
      {/*POPUP*/}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1e1e1e',
              padding: '20px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: '20px',
              maxWidth: '900px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >

            {/*IMAGE*/}
            <div style={{ textAlign: 'center' }}>
              <img
                src={selectedCard.images.large}
                alt={selectedCard.name}
                style={{
                  width: '100%',
                  maxWidth: '300px'
                }}
              />
            </div>

            {/*DETAILS*/}
            <div style={{ color: '#fff' }}>
              <h2>{selectedCard.name}</h2>

              <p><strong>HP:</strong> {selectedCard.hp}</p>
              <p><strong>Type:</strong> {selectedCard.types?.join(', ')}</p>

              {selectedCard.abilities && (
                <>
                  <p><strong>Abilities:</strong></p>
                  {selectedCard.abilities.map((a, i) => (
                    <p key={i}>{a.name}: {a.text}</p>
                  ))}
                </>
              )}

              {selectedCard.attacks && (
                <>
                  <p><strong>Attacks:</strong></p>
                  {selectedCard.attacks.map((atk, i) => (
                    <p key={i}>
                      {atk.name}
                      {atk.damage && ` (${atk.damage})`}
                      {atk.text && ` - ${atk.text}`}
                    </p>
                  ))}
                </>
              )}

              {selectedCard.flavorText && (
                <>
                  <div style={{
                    margin: '10px 0',
                    borderTop: '2px dashed #ffcb05'
                  }}></div>

                  <p style={{ fontStyle: 'italic' }}>
                    {selectedCard.flavorText}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
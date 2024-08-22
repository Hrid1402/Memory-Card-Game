import { useEffect, useState } from 'react'
import './styles/App.css'
import './styles/cards.css'
import {getPokemons} from './apiCall.js'
import loadingICON from './assets/loadingICON.png'
import { DifficultyButton } from './components/buttons.jsx'



function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function createPokemonCards(n) {
    let newPokemons = allPokemons;
    for(let i = 1; i <= n; i++) {
      let pokemon = await getPokemons(i);
      newPokemons.push(pokemon.sprites.other["official-artwork"].front_default);
      setAllPokemons(newPokemons);
      
    }
  }
  
  


  function changeDifficulty(newDifficulty) {
    setDifficulty(newDifficulty);
    console.log(`You selected ${newDifficulty} difficulty`);
  }
  useEffect(() => {
    if (difficulty !== null) {
        const fetchPokemons = async () => {
        await createPokemonCards(12);
        setIsLoading(false);
      };
      fetchPokemons();
    }
  }, [difficulty]);

  function MainMenu({curDifficulty, allPokemons}){
    if(curDifficulty == null){
      return(
        <section>
          <h1>Pokémon Memory Cards Game</h1>
          <p className="read-the-docs">
            In each round, spot and click the different Pokémon card without repeating your previous choices. 
          </p>
          <p>Choose your difficulty:</p>
          <div className='buttons'>
            <DifficultyButton txt="Easy" difficulty={"easy"} callback={changeDifficulty}/>
            <DifficultyButton txt="Medium" difficulty={"medium"} callback={changeDifficulty}/>
            <DifficultyButton txt="Hard" difficulty={"hard"} callback={changeDifficulty}/>
          </div>
        </section>
      )
    }else if(isLoading){
      return(
        <div className='loading'>
          <img src={loadingICON} alt=""/>
          <h1>Loading...</h1>
        </div>
      )
    }else{
      return(
        <div className='gameBlock'>
          <h1>Pokemons left: 20</h1>
          <div className='cards'>
            {allPokemons.map((pokemon, index) => {
              return(
                <div className='card' key={index}>
                  <img src={pokemon} alt={`Pokemon ${index}`}/>
                </div>
              )
            })}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <MainMenu curDifficulty={difficulty} allPokemons={allPokemons}></MainMenu>
    </>
    
    
  )
}

export default App

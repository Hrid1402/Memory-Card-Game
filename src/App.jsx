import { useEffect, useState } from 'react'
import './styles/App.css'
import './styles/cards.css'
import {getPokemons} from './apiCall.js'
import loadingICON from './assets/loadingICON.png'
import { DifficultyButton } from './components/buttons.jsx'
import { v4 as uuidv4 } from 'uuid';



let allPokemons = [];
let pokemonTotal = 12;
let clickedPokemons = [];
function App() {
  const [curPokemons, setCurPokemons] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  async function createPokemonCards(n) {

    for(let i = 1; i <= n; i++) {
      let pokemon = await getPokemons(i);
      allPokemons.push({sprite:pokemon.sprites.other["official-artwork"].front_default, name:pokemon.name});
    }
  }

  function setRandomPokemons(pokemonTotal, allPokemons){
    let randomPokemons = [];
    let copy = [...allPokemons];

    for(let i = 0; i < pokemonTotal; i++){
      let randomIndex = Math.floor(Math.random() * copy.length);
      randomPokemons.push(copy[randomIndex]);
      copy.splice(randomIndex, 1);
    }
    setCurPokemons(randomPokemons);
  }
  


  function changeDifficulty(newDifficulty) {
    setDifficulty(newDifficulty);
    console.log(`You selected ${newDifficulty} difficulty`);
  }
  useEffect(() => {
    if (difficulty !== null) {
        const fetchPokemons = async () => {
        await createPokemonCards(pokemonTotal);
        setRandomPokemons(pokemonTotal, allPokemons);
        setIsLoading(false);
      };
      fetchPokemons();
    }
  }, [difficulty]);

  function MainMenu({curDifficulty, curPokemons}){


    function handleCardClick(name){
      if(clickedPokemons.includes(name)){
        console.log("You already clicked this card!!!!!");
      }else{
        console.log(`${name} clicked`);
        clickedPokemons.push(name);
        setRandomPokemons(pokemonTotal, allPokemons);
      }
      
    }
    function PokemonCard({name, sprite}){
      return( 
        <div key={uuidv4()} className='card' onClick={() => handleCardClick(name)} >
          <img src={sprite} alt={name}/>
        </div>
        )
    }
    
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
          <h1>Pokemons left: {pokemonTotal}</h1>
          <div className='cards'>
            {curPokemons.map((pokemon) => {
              return(
                <PokemonCard name={pokemon.name} sprite={pokemon.sprite} key={uuidv4()}/>
              )
            })}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <MainMenu curDifficulty={difficulty} curPokemons={curPokemons}></MainMenu>
    </>
    
    
  )
}

export default App

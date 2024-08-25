import { useEffect, useState } from 'react'
import './styles/App.css'
import './styles/cards.css'
import './styles/gameOver.css'
import {getPokemons} from './apiCall.js'
import loadingICON from './assets/loadingICON.png'
import { DifficultyButton } from './components/buttons.jsx'
import { v4 as uuidv4 } from 'uuid';



let allPokemons = [];
let pokemonTotal = 12;
const amountOfPokemons = {
  easy: 12,
  medium: 18,
  hard: 24
}
let clickedPokemons = [];
function App() {
  const [pokemonsLeft, setPokemonsLeft] = useState(pokemonTotal);
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
    const freePokemons = allPokemons.filter(pokemon => !clickedPokemons.includes(pokemon.name));
    const amountNewPokemons = (freePokemons.length <= 12) ? Math.floor(Math.random() * freePokemons.length) + 1 : Math.floor(Math.random() * 12) + 1;
    const extraPokemons = 12 - amountNewPokemons;


    
    for (let i = 0; i < amountNewPokemons; i++) {
      let randomIndex = Math.floor(Math.random() * freePokemons.length);
      randomPokemons.push(freePokemons[randomIndex]);
      console.log("randomIndex", randomIndex);
      console.log(freePokemons);
      console.log("FREE", freePokemons[randomIndex]);
      freePokemons.splice(randomIndex, 1);
    }
    for (let i = 0; i < extraPokemons; i++) {
      let randomIndex;
      do{
        randomIndex = Math.floor(Math.random() * copy.length);
      }while(randomPokemons.includes(copy[randomIndex]));
      randomPokemons.push(copy[randomIndex]);
      console.log("extra", copy[randomIndex]);
      copy.splice(randomIndex, 1);
      
    }
    setCurPokemons(randomPokemons);


  }
  


  function changeDifficulty(newDifficulty) {
    setDifficulty(newDifficulty);
    pokemonTotal = amountOfPokemons[newDifficulty];
    setPokemonsLeft(pokemonTotal);
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
    const [isGameOver, setIsGameOver] = useState(false);
    function DialogBox(){
      return(
        <div className='endScreen'>
          <div className='content'>
            <h1>YOU LOSE</h1>
          </div>
        </div>
      )
    }
    useEffect(() => {
      if (pokemonsLeft === 0) {
          setIsGameOver(true);
      }
    }, [pokemonsLeft]);

    function handleCardClick(name){
      if(clickedPokemons.includes(name)){
        console.log(`You already clicked ${name}!!!!!`);
        const freePokemons = allPokemons.filter(pokemon => !clickedPokemons.includes(pokemon.name));
        console.log(freePokemons);
        setIsGameOver(true);
      }else{
        console.log(`----------------${name} clicked`);
        clickedPokemons.push(name);

        const newPokemonsLeft = pokemonsLeft - 1;
        setPokemonsLeft(newPokemonsLeft);
        if(newPokemonsLeft == 0){
          console.log("GAME OVER, YOU WON!");
        }else{
          setRandomPokemons(pokemonTotal, allPokemons);
        }
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
          {isGameOver ? <DialogBox/>: null}
          <h1>Pokemons left: {pokemonsLeft}</h1>
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

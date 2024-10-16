import React, { useState, useEffect } from "react";
import './App.css';  // Import the CSS file
import StatSection from './StatSection';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for excluded attributes
  const [excludedTypes, setExcludedTypes] = useState(new Set());
  const [excludedAbilities, setExcludedAbilities] = useState(new Set());
  const [excludedEggGroups, setExcludedEggGroups] = useState(new Set());
  const [excludedGenerations, setExcludedGenerations] = useState(new Set());

  const fetchRandomPokemon = () => {
    setLoading(true);
    const randomId = Math.floor(Math.random() * 1025) + 1;

    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`).then((response) => response.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`).then((response) => response.json())
    ])
      .then(([pokemonData, speciesData]) => {
        const matchesExcludedType = pokemonData.types.some((typeInfo) => excludedTypes.has(typeInfo.type.name));
        const matchesExcludedAbility = pokemonData.abilities.some((abilityInfo) => excludedAbilities.has(abilityInfo.ability.name));
        const matchesExcludedEggGroup = speciesData.egg_groups.some((eggGroup) => excludedEggGroups.has(eggGroup.name));
        const matchesExcludedGeneration = excludedGenerations.has(speciesData.generation.name);

        if (matchesExcludedType || matchesExcludedAbility || matchesExcludedEggGroup || matchesExcludedGeneration) {
          fetchRandomPokemon();
        } else {
          setPokemonData(pokemonData);
          setSpeciesData(speciesData);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching Pokémon or species data:", error);
        setLoading(false);
      });
  };

  // Toggle functions for each attribute
  const toggleExcludedType = (type) => setExcludedTypes((prevTypes) => updateSet(prevTypes, type));
  const toggleExcludedAbility = (ability) => setExcludedAbilities((prevAbilities) => updateSet(prevAbilities, ability));
  const toggleExcludedEggGroup = (eggGroup) => setExcludedEggGroups((prevEggGroups) => updateSet(prevEggGroups, eggGroup));
  const toggleExcludedGeneration = (generation) => setExcludedGenerations((prevGenerations) => updateSet(prevGenerations, generation));

  const updateSet = (set, item) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    return newSet;
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <div className="app-container">
      <br></br>
      <img src="https://archives.bulbagarden.net/media/upload/2/2f/Poke_Ball_RG.png" width="100px"></img>
      <h1>Random Pokémon Generator</h1>
      <h2>Summon random Pokémon and filter out by your criteria!</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="content-container">
          {pokemonData && (
            <>
              <h3>{pokemonData.species.name.toUpperCase()}</h3>
              <img className="poke-image"
                src={pokemonData.sprites.front_default}
                alt={pokemonData.species.name}
              />

              <div className="stats-container">

                <StatSection
                  title="Generation"
                  data={[{ name: speciesData.generation.name }]}
                  excludedSet={excludedGenerations}
                  toggleExclude={toggleExcludedGeneration}
                />

                <StatSection
                  title="Types"
                  data={pokemonData.types.map(typeInfo => typeInfo.type)}
                  excludedSet={excludedTypes}
                  toggleExclude={toggleExcludedType}
                />


                <StatSection
                  title="Abilities"
                  data={pokemonData.abilities.map(abilityInfo => abilityInfo.ability)}
                  excludedSet={excludedAbilities}
                  toggleExclude={toggleExcludedAbility}
                />

                <StatSection
                  title="Egg Groups"
                  data={speciesData.egg_groups}
                  excludedSet={excludedEggGroups}
                  toggleExclude={toggleExcludedEggGroup}
                />

              </div>
            </>
          )}
        </div>
      )}
      <button className="button" onClick={fetchRandomPokemon}>Get Another Pokémon</button>
      <br></br>
    </div>
  );
}

export default App;

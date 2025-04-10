"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=80";
    fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        const pokemonPromises = data.results.map(async (pokemon) => {
          const id = pokemon.url.split("/")[6];

          // Fetch pokemon details to get moves
          const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          const pokemonData = await pokemonResponse.json();

          // Get a random move from the pokemon's moves
          const randomMoveIndex = Math.floor(
            Math.random() * pokemonData.moves.length
          );
          const moveUrl = pokemonData.moves[randomMoveIndex].move.url;
          // Fetch move details
          const moveResponse = await fetch(moveUrl);
          const moveData = await moveResponse.json();

          return {
            id,
            name: pokemon.name,
            defense: moveData.name,
          };
        });

        const pokemonList = await Promise.all(pokemonPromises);
        pokemonList.sort((a, b) => a.name.localeCompare(b.name));
        setPokemons(pokemonList);
      })
      .catch((error) => {
        console.error("Error fetching pokemon data:", error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPokemons =
    filteredPokemons.length > 0
      ? filteredPokemons.slice(indexOfFirstItem, indexOfLastItem)
      : pokemons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pokemons.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.value;
    const currentFilterPokemons = pokemons.filter((pokemon) =>
      pokemon.name.includes(query)
    );
    setFilteredPokemons(currentFilterPokemons);
  };

  const handleSortAsc = () => {
    const sortedPokemons = [...pokemons].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setPokemons(sortedPokemons);
  };

  const handleSortDesc = () => {
    const sortedPokemons = [...pokemons].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
    setPokemons(sortedPokemons);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <div className={styles.searchContainer}>
            <input
              placeholder="Buscar pokemon"
              onChange={(e) => handleSearch(e)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonsContainer}>
            <button onClick={handleSortAsc} className={styles.ascButton}>
              Ascendente
            </button>
            <button onClick={handleSortDesc} className={styles.descButton}>
              Descendente
            </button>
          </div>
          <div className={styles.cardContainer}>
            {currentPokemons.length > 0 ?currentPokemons.map((pokemon) => (
              <div className={styles.card} key={pokemon.name}>
                <div className={styles.imageContainer}>
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                    width={100}
                    height={100}
                    alt={pokemon.name}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h2>{pokemon.name}</h2>
                  <p>{pokemon.defense}</p>
                </div>
              </div>
            )): <p>Loading...</p>}
          </div>

          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  className={`${styles.pageButton} ${
                    currentPage === number ? styles.active : ""
                  }`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

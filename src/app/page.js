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
      .then((data) => {
        const pokemonList = data.results.map((pokemon) => {
          const id = pokemon.url.split("/")[6];
          const moveUrl = `https://pokeapi.co/api/v2/move/${1}`

          const move = fetch(moveUrl).then((response) => response.json());

          console.log(move);

          return {
            id,
            name: pokemon.name,
            defense: 'defensa ataque',
          };
        });
        setPokemons(pokemonList);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPokemons = filteredPokemons.length > 0 ? filteredPokemons : pokemons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pokemons.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.value;
    const currentFilterPokemons = pokemons.filter((pokemon) => pokemon.name.includes(query));
    setFilteredPokemons(currentFilterPokemons);
  };

  const handleSortAsc = (e) => {
    const sortedPokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name));
    setPokemons(sortedPokemons);
  };

  const handleSortDesc = (e) => {
    const sortedPokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name));
    setPokemons(sortedPokemons.reverse());
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <div className={styles.searchContainer}>
            <input placeholder="Buscar pokemon" onChange={(e) => handleSearch(e)} className={styles.searchInput}/>
          </div>
          <div className={styles.buttonsContainer}>
            <button onClick={handleSortAsc} className={styles.ascButton}>Ascendente</button>
            <button onClick={handleSortDesc} className={styles.descButton}>Descendente</button>
          </div>
          <div className={styles.cardContainer}>
            {currentPokemons.map((pokemon) => (
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
            ))}
          </div>
          
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`${styles.pageButton} ${
                  currentPage === number ? styles.active : ''
                }`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokeinfo from "./PokeInfo";
import axios from "axios";

const Main = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [pokeDex, setPokeDex] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const pokeFun = async () => {
    setLoading(true);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };

  const getPokemon = async (res) => {
    res.map(async (item) => {
      const result = await axios.get(item.url);
      setPokeData((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    });
  };
  const handleInfoClose = () => {
    setPokeDex(null);
  }; // Function to close the Pokeinfo card

  useEffect(() => {
    pokeFun();
  }, [url]);

  // Filter the pokeData array based on search query
  const filteredData = pokeData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abilities.some((ability) =>
        ability.ability.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <>
      <div className="container">
        <div className="container3 mt-2">
          <form className="d-flex fm">
            <input
              className="form-control me-2 inp"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="container2">
          <div className="left-content">
            <Card
              pokemon={filteredData}
              loading={loading}
              infoPokemon={(poke) => setPokeDex(poke)}
            />

            <div className="btn-group">
              {prevUrl && (
                <button
                  onClick={() => {
                    setPokeData([]);
                    setUrl(prevUrl);
                  }}
                >
                  Previous
                </button>
              )}

              {nextUrl && (
                <button
                  onClick={() => {
                    setPokeData([]);
                    setUrl(nextUrl);
                  }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
          <div className="right-content">
            <Pokeinfo data={pokeDex} onClose={handleInfoClose} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;

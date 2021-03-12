import React, { useState } from "react";
import "./App.scss";
import Search from "../Search";
import SatelliteImage from "../SatelliteImage";

const App = () => {
  const [place, setPlace] = useState({});
  return (
    <main>
      <Search className="search" setPlace={setPlace} />
      <SatelliteImage
        className="satellite-image"
        lon={place.lon}
        lat={place.lat}
      />
    </main>
  );
};

export default App;

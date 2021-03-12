import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const API = `https://api.nasa.gov/planetary/earth/assets?`;
const API_KEY = "OK8cUh6wedKKVub04zUzLcIVDpX8eJbe6A7wjUUB";

const SatelliteImage = ({ className, lon, lat }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const config = {
        lon,
        lat,
        date: "2021-03-09",
        dim: "0.7",
        key: API_KEY,
        get: () => {
          return `lon=${config.lon}&lat=${config.lat}&dim=${config.dim}&api_key=${API_KEY}`;
        },
      };

      setIsLoading(true);
      setIsImageLoaded(false);
      setError(null);

      fetchImage(API, config);
    }
  }, [lon && lat]);

  async function fetchImage(API, config) {
    try {
      const response = await fetch(`${API}${config.get()}`);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setIsLoading(false);
      setData(data);
      return data;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error(error);
    }
  }

  const Content = () => {
    if (isLoading) {
      <Loading />;
    } else if (error) {
      return (
        <div className="error">No satellite image found for this location.</div>
      );
    } else if (data) {
      return (
        <>
          {isImageLoaded ? null : <Loading />}
          <img
            src={data.url}
            style={isImageLoaded ? {} : { display: "none" }}
            onLoad={() => setIsImageLoaded(true)}
          />
        </>
      );
    }
    return null;
  };

  const Loading = () => (
    <div className="loading">
      <CircularProgress />
    </div>
  );

  return (
    <div className={className}>
      <Content />
    </div>
  );
};

export default SatelliteImage;

import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import onClickOutside from "react-onclickoutside";

const API = `https://nominatim.openstreetmap.org/search?`;

const Search = ({ className, setPlace }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);

  const isInitialMount = useRef(true);

  Search.handleClickOutside = () => setShowSuggestions(false);

  useEffect(() => {
    const config = new Config(searchValue);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchData(API, config).then((data) => setData(data.slice(0, 5)));
    }
  }, [searchValue]);

  async function fetchData(API, config) {
    try {
      const response = await fetch(`${API}${config.get()}`);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  class Config {
    constructor(q, format = "json") {
      this.q = q;
      this.format = format;
    }
    get() {
      return `q=${this.q}&format=${this.format}`;
    }
  }

  const listItems = data.map((place) => (
    <ListItem
      key={place.place_id}
      button
      onClick={(event) => handleItemClick(event, place)}
    >
      <ListItemText primary={place.display_name} />
    </ListItem>
  ));

  const handleInputChange = (event) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setInputValue(event.target.value);

    if (event.target.value !== "") {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    setTypingTimeout(
      setTimeout(() => {
        setSearchValue(event.target.value);
      }, 250)
    );
  };

  const handleItemClick = (event, place) => {
    triggerSubmit(place);
  };

  const handleInputSubmit = (event) => {
    event.preventDefault();
    const config = new Config(inputValue);
    fetchData(API, config).then((data) => {
      setData(data.slice(0, 5));
      triggerSubmit(data[0]);
    });
  };

  const triggerSubmit = (place) => {
    if (place) {
      setInputValue(place.display_name);
      setSearchValue(place.display_name);
      setPlace(place);
    } else {
      setInputValue("");
      setSearchValue("");
      setPlace({ lon: null, lat: null });
    }
    setShowSuggestions(false);
  };

  const handleInputClick = () => {
    if (inputValue && !showSuggestions) {
      setShowSuggestions(true);
    }
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
    },

    box: {
      display: "flex",
    },

    input: {
      flex: 1,
      marginLeft: 15,
    },

    list: {
      padding: 0,
    },
  }));

  const classes = useStyles();

  return (
    <div className={className}>
      <Paper
        component="form"
        className={classes.root}
        onSubmit={handleInputSubmit}
      >
        <Box className={classes.box}>
          <InputBase
            className={classes.input}
            placeholder="Search location"
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
          />
          <IconButton type="submit" className={classes.iconButton}>
            <SearchIcon />
          </IconButton>
        </Box>
        {showSuggestions && (
          <List className={classes.list} component="ul">
            {listItems}
          </List>
        )}
      </Paper>
    </div>
  );
};

const clickOutsideConfig = {
  handleClickOutside: () => Search.handleClickOutside,
};

export default onClickOutside(Search, clickOutsideConfig);

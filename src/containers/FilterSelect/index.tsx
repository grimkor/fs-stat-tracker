import React, {FC, useContext} from "react";
import {Checkbox, Input, InputLabel, ListItemText, MenuItem, Select, Theme,} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {MatchTypesObj} from "../../types";
import {AppContext} from "../../context";
import {filterIdtoName, filterNameToId} from "../../helpers/filterHelpers";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  label: {
    marginRight: theme.spacing(),
  },
}));

const FilterSelect: FC = () => {
  const {filter, setFilter} = useContext(AppContext);
  const {label, root} = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const list = event.target.value as string[];
    //TODO: See why this returns as type (number | undefined) even after the filter.
    const newFilters = list.map(filterNameToId).filter((x) => x !== undefined);
    setFilter(newFilters as number[]);
  };

  const filterNames = filter.map(filterIdtoName);

  return (
    <div className={root}>
      <InputLabel className={label} id="filter-select-label">
        Filter:
      </InputLabel>
      <Select
        labelId="filter-select-label"
        multiple
        value={filterNames}
        onChange={handleChange}
        input={<Input/>}
        renderValue={(selected) => (selected as number[]).join(", ")}
      >
        {Object.keys(MatchTypesObj).map((label) => (
          <MenuItem key={label} value={label}>
            <Checkbox checked={filterNames.includes(label)}/>
            <ListItemText primary={label}/>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default FilterSelect;

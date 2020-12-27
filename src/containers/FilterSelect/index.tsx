import React, { FC, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { MatchTypesObj } from "../../types";
import { AppContext, defaultContext } from "../../context";
import { filterNameToId } from "../../helpers/filterHelpers";
import DateInput from "../../components/DateInput";
import FormHeader from "../../components/FormHeader";
import FormGroup from "../../components/FormGroup";
import DateFormGroup from "../../components/DateFormGroup";
import CheckboxInput from "../../components/CheckboxInput";
import moment from "moment";

const FilterSelect: FC = () => {
  const { filter, setFilter } = useContext(AppContext);
  const [formData, setFormData] = useState({ ...filter });
  const [visible, setVisible] = useState(false);

  const handleButton = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const handleReset = () => {
    setFormData({ ...defaultContext.filter });
  };

  const handleSubmit = () => {
    setFilter(formData);
    setVisible(false);
  };

  const handleCheckboxChange = (choice: string) => () => {
    let matchTypes = [...formData.matchTypes];
    const isChecked = matchTypes.find((x) => x === filterNameToId(choice));
    if (isChecked) {
      matchTypes = matchTypes.filter((x) => x !== filterNameToId(choice));
    } else {
      matchTypes.push(filterNameToId(choice));
      matchTypes.sort();
    }
    setFormData({ ...formData, matchTypes });
  };

  const handleDateCheckbox = () => {
    setFormData({ ...formData, filterDate: !formData.filterDate });
  };

  const handleDateChange = (dateName: "startDate" | "endDate") => (
    date: number
  ) => {
    const newDate =
      dateName === "startDate"
        ? moment.unix(date).startOf("day").unix()
        : moment.unix(date).endOf("day").unix();
    setFormData({
      ...formData,
      date: { ...formData.date, [dateName]: newDate },
    });
  };

  return (
    <>
      <Button onClick={handleButton}>Filter</Button>
      <Dialog
        open={visible}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle>Set Filter</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormHeader text="Match Type:" />
            {Object.keys(MatchTypesObj).map((label) => (
              <CheckboxInput
                key={label}
                checked={formData.matchTypes.includes(filterNameToId(label))}
                onChange={handleCheckboxChange(label)}
                label={label}
              />
            ))}
          </FormGroup>
          <FormGroup>
            <FormHeader text="Date Range:" />
            <CheckboxInput
              checked={formData.filterDate}
              onChange={handleDateCheckbox}
              label="Filter by date"
            />
            <DateFormGroup>
              <DateInput
                enabled={formData.filterDate}
                value={formData.date?.startDate}
                onChange={handleDateChange("startDate")}
                label="Start Date"
              />
              <DateInput
                enabled={formData.filterDate}
                value={formData.date?.endDate}
                onChange={handleDateChange("endDate")}
                label="End Date"
              />
            </DateFormGroup>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset} color="secondary" variant="contained">
            Reset
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Set Filter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterSelect;

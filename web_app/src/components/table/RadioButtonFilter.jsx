import { MenuItem, Radio, ListItemText } from '@mui/material';

/**
 * Table filter that allows to select between a list of radio buttons
 * @returns {object}
 */
export default function radioButtonFilter(name, label, radioButtons, filterFn, defaultValue = null) {
  return {
    name,
    label,
    filterFn,
    chips: (selected) => [radioButtons.find(([target]) => target === selected)],
    onClick: (setFilter, value, target) => {
      if (target === value) setFilter(name, defaultValue);
      else setFilter(name, target);
    },
    component: RadioButtonFilter,
    persist: true,
    defaultValue,
    radioButtons,
  };
}

function RadioButtonFilter({ filter, setFilter, value }) {
  return filter.radioButtons.map(([target, label]) => (
    <MenuItem key={target} dense onClick={() => filter.onClick(setFilter, value, target)}>
      <Radio checked={value === target} value={target} />
      <ListItemText primary={label} />
    </MenuItem>
  ));
}

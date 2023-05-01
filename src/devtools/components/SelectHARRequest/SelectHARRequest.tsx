import React, { Dispatch, FC } from "react";
import HAREntry = chrome.devtools.network.Request;

interface SelectHARRequestProps {
  options: HAREntry[];
  value: HAREntry | null;
  onChange: Dispatch<HAREntry | null>;
}

const UNDEFINED_SELECT_VALUE = "-";

const getValueFromHAR = (item: HAREntry | null) =>
  item ? `${item.request.url}-${item.startedDateTime}` : UNDEFINED_SELECT_VALUE;

export const SelectHARRequest: FC<SelectHARRequestProps> = ({
  value,
  options,
  onChange,
}) => (
  <select
    value={getValueFromHAR(value)}
    onChange={(event) => {
      onChange(
        options.find((item) => event.target.value === getValueFromHAR(item)) ||
          null
      );
    }}
  >
    <option value={UNDEFINED_SELECT_VALUE}>Select request with SSR</option>
    {options.map((item) => (
      <option key={getValueFromHAR(item)} value={getValueFromHAR(item)}>
        {item.request.url}
      </option>
    ))}
  </select>
);

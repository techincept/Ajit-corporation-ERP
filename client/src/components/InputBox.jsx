/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import { searchDataContext } from "../context/SearchDataContext";

function InputBox({ type, name, value, className, label, onChange }) {
  const { isFormFilled, isEditMode } = useContext(searchDataContext);
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isNaN(value)) return;

    const handleFocusOut = () => {
      setIsFocused(false);
    };
    const handleFocusIn = () => {
      setIsFocused(true);
    };

    const input = ref.current;

    input.addEventListener("focusout", handleFocusOut);
    input.addEventListener("focusin", handleFocusIn);

    return () => {
      input.removeEventListener("focusout", handleFocusOut);
      input.removeEventListener("focusin", handleFocusIn);
    };
  });

  return (
    <div className="grid ">
      <label htmlFor={name}>{label}</label>
      <input
        ref={ref}
        required
        className={` mt-1 h-fit w-36 border border-gray-400 p-1 ${className} `}
        type={type}
        name={name}
        value={
          Number(value) ? (isFocused ? value : Number(value).toFixed(2)) : value
        }
        onChange={onChange}
        tabIndex={isFormFilled && !isEditMode ? "-1" : "0"}
      />
    </div>
  );
}

export default InputBox;

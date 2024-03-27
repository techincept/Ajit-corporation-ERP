import { useUnmountEffect } from "framer-motion";
import { useState } from "react";

export default function useCurrentDateString() {
  const [currentDate, setCurrentDate] = useState("");

  useUnmountEffect(() => {
    const curr = new Date().toLocaleDateString("en");

    // setCurrentDate(date);
  });

  return currentDate;
}

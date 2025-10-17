import { createContext, useContext, useState } from "react";

const EventFilterContext = createContext();

export const EventFilterProvider = ({ children }) => {
  const [filter, setFilter] = useState("all"); // 'all', 'screening', or 'discussion'

  return (
    <EventFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </EventFilterContext.Provider>
  );
};

export const useEventFilter = () => useContext(EventFilterContext);

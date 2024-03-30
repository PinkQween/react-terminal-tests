import { useContext, useEffect, useState } from "react";
import globalsContext from "./utils/globalsContext";

const App = () => {
  const [globals, setGlobals] = useState({});

  const { global } = useContext(globalsContext)

  useEffect(() => {
    setGlobals(global)
  }, [global])

  return (
    <>
      {globals.input}
    </>
  )
}

export default App;
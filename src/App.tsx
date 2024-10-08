import { Web3ModalProvider } from "./providers/web3modal"
import { DarkModeProvider } from "./context/DarkModeContext"
import { RouterProvider } from "react-router-dom";
import router from "./route";
import { StoreProvider } from "./context/StoreContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <Web3ModalProvider>
      <DarkModeProvider>
        <StoreProvider>
          <ToastContainer position="bottom-left" theme="colored" />
          <RouterProvider router={router} />
        </StoreProvider>
      </DarkModeProvider>
    </Web3ModalProvider>
  )
}

export default App

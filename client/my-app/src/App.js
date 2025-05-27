import './App.css';
import RoutesComponent from './project/RoutesComponent';
import { UserProvider } from './project/Context';

function App() {
  return (
    <UserProvider>
      <RoutesComponent />
    </UserProvider>
  );
}

export default App;
import './App.css';
import Contacts from './pages/Contacts'
import GetContact from './pages/GetContact'
import Auth from './pages/Auth'
import { Route, Switch } from 'react-router-dom'

function App() {
  return (
    <Switch>
      <Route path="/auth">
        <Auth/>
      </Route>
      <Route path="/contacts">
        <Contacts/>
      </Route>
      <Route path="/get-contact">
        <GetContact/>
      </Route>
      <Route path="/">
        <Auth/>
      </Route>
    </Switch>
  );
}

export default App;

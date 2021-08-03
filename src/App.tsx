import { Container } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from './components/nav';
import { MediaProvider } from './contexts/mediaContext';
import Home from './views/home';
import Login from './views/login';
import Logout from './views/logout';
import Profile from './views/profile';

const App = () => {

  return (
    <Router>
      <MediaProvider>
        <Container
          maxWidth="xl"
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <Nav />
          <main style={{ marginTop: 64, textAlign: 'center' }}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <Route path="/profile" component={Profile} />
            </Switch>
          </main>

        </Container>
      </MediaProvider>
    </Router >

  );
}

export default App;

import { Container } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from './components/nav';
import Home from './views/home';
import Login from './views/login';

const App = () => {

  return (
    <Router>
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
          </Switch>
        </main>

      </Container>
    </Router >

  );
}

export default App;

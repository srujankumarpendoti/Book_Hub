import {Route, Switch} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Books from './components/Books'
import BookDetails from './components/BookDetails'
import NotFound from './components/NotFound'

import './App.css'

// use the below bookshelvesList for rendering read status of book items in Bookshelves Route

const App = () => (
  <>
    <Switch>
      <Route path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/shelf" component={Books} />
      <ProtectedRoute exact path="/books/:id" component={BookDetails} />
      {/* <ProtectedRoute exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" /> */}
      <Route component={NotFound} />
    </Switch>
  </>
)

export default App

//  24/07 7.5 hours
// 25/07 2.5 hrs 2hrs Done 2.5hrs
//

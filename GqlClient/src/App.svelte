<script>
  import { Router, Route, Link } from 'svelte-routing';
  import Login from './lib/Login.svelte';
  import Signup from './lib/Signup.svelte';
  import Images from './lib/Images.svelte';
  // import User from './lib/GetUser.svelte';
  import Admin from './lib/Admin.svelte';
  import GetUser from './lib/GetUser.svelte';
</script>

<Router>
  <Route path="/" component={Signup} />
  <Route path="/login" component={Login} />
  <Route path="/signup" component={Signup}/>
  <Route path="/images" component={Images} />
  <Route path="/users" component={Admin}/>
  <Route path='/getusers' component={GetUser}/>
  <Route path='/login' component={Login}/>
</Router>

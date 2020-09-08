import {BrowserRouter, Switch, Route} from "react-router-dom";
import React from "react";
import {UserSelect} from "./user-select/user-select";
import {Schedule} from "./schedule/schedule";
import {UserBar} from "./user-bar/user-bar";

export const App = () => (
  <BrowserRouter>
      <Switch>
          <Route exact path="/">
              <UserSelect />
          </Route>
          <Route path="/schedule">
              <div>
                  <UserBar />
              </div>
              <div>
                  <Schedule />
              </div>
          </Route>
      </Switch>
  </BrowserRouter>
);
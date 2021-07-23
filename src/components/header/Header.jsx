import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import "./Header.scss";

export const Header = (props) => {
  return (
    <div className="Header">
      <AppBar className="Header-appBar">
        <Container fixed>
          <Toolbar className="toolbar">
            <div className='Header-block'>
              <Typography className="Header-logoText">
                {props.heading}
              </Typography>
            </div>
            {props.children}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
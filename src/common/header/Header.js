import React, { Component } from "react";
import "./Header.css";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import profilePic from "../../assets/profilePic.jpg";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    backgroundColor: "#DFDFDF",
    padding: "6px 15px",
    boxShadow: "none",
    marginTop: 2,
  },
})(Menu);

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 4,
    minHeight: "auto",
    "&:focus": {
      backgroundColor: theme.palette.grey,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false,
      anchorEl: null,
    };
  }

  profileIconHandler = (event) => {
    this.setState({
      openMenu: !this.state.openMenu,
      anchorEl: event.currentTarget,
    });
  };

  closeMenu = () => {
    this.setState({ openMenu: !this.state.openMenu, anchorEl: null });
  };

  myAccountHandler = () => {
    this.props.history.push("/profile");
  };

  logoutHandler = () => {
    sessionStorage.removeItem("access-token");
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <header className="app-header">
          <span className="app-logo">Image Viewer</span>
          {this.props.loggedIn ? (
            <div className="app-header-right">
              <Input
                type="search"
                placeholder="Search…"
                disableUnderline
                className="search-box"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                }
              />
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={this.profileIconHandler}
                style={{ padding: "5px 10px" }}
              >
                <Avatar
                  variant="circular"
                  alt={profilePic}
                  src={profilePic}
                ></Avatar>
              </IconButton>
              <StyledMenu
                id="simple-menu"
                open={this.state.openMenu}
                onClose={this.closeMenu}
                anchorEl={this.state.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                keepMounted
              >
                <StyledMenuItem onClick={this.myAccountHandler}>
                  <Typography>My Account</Typography>
                </StyledMenuItem>
                <Divider variant="fullWidth" />
                <StyledMenuItem onClick={this.logoutHandler}>
                  <Typography>Logout</Typography>
                </StyledMenuItem>
              </StyledMenu>
            </div>
          ) : (
            ""
          )}
        </header>
      </div>
    );
  }
}

export default Header;

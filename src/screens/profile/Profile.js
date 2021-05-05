import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./Profile.css";
import Header from "../../common/header/Header";
import profilePic from "../../assets/profilePic.jpg";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

const styles = (theme) => ({
  avatar: {
    width: 150,
    height: 150,
  },
  editIcon: {
    margin: "10px 0 0 10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editModalContent: {
    backgroundColor: "white",
    width: 200,
    padding: 25,
    borderRadius: 4,
    border: "2px solid #dcd6d6",
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: sessionStorage.getItem("access-token"),
      loggedIn: sessionStorage.getItem("access-token") === null ? false : true,
      likeCountList: JSON.parse(sessionStorage.getItem("likeCountList")),
      commentList: JSON.parse(sessionStorage.getItem("commentList")),
      mediaList: [],
      username: "",
      numOfPosts: 0,
      followers: 93,
      following: 138,
      name: "Shobhit Srivastava",
      editModalIsopen: false,
      mediaModalIsopen: false,
      fullName: "",
      fullNameRequired: "dispNone",
    };
  }

  componentDidMount() {
    this.fectchUserName();
    this.fetchImageDetails();
  }

  fectchUserName = () => {
    let url =
      this.props.baseUrl +
      "me?fields=id,username&access_token=" +
      this.state.accessToken;
    fetch(url)
      .then(
        (resp) => {
          if (resp.status === 200) {
            resp.json().then((resp) => {
              console.log(resp);
              this.setState({ username: resp.username });
            });
          }
        },
        (err) => console.log(err)
      )
      .catch((err) => console.log(err));
  };

  fetchImageDetails = () => {
    let that = this;
    fetch(
      `https://graph.instagram.com/me/media?fields=id,caption&access_token=${this.state.accessToken}`
    )
      .then(
        (rsp) => {
          if (rsp.status === 200) {
            rsp.json().then((res) => {
              console.log("res", res);
              this.setState({ numOfPosts: res.data.length });
              const promises = res.data.map((item) =>
                fetch(
                  `https://graph.instagram.com/${item.id}?fields=id,media_type,media_url,username,timestamp&access_token=${this.state.accessToken}`
                )
              );
              Promise.all(promises)
                .then(
                  (responses) => {
                    return Promise.all(
                      responses.map(function (response) {
                        return response.json();
                      })
                    );
                  },
                  (err) => console.log(err)
                )
                .then(
                  function (data) {
                    console.log("data", data);
                    data.forEach((media, i) => {
                      const mediaCaption = res.data[i];
                      if (mediaCaption.caption) {
                        media.caption = mediaCaption.caption;
                        media.hashtags = mediaCaption.caption
                          .split(" ")
                          .filter((str) => str.startsWith("#"))
                          .join(" ");
                        media.trimmedCaption = mediaCaption.caption.replace(
                          /(^|\s)#[a-zA-Z0-9][^\\p{L}\\p{N}\\p{P}\\p{Z}][\w-]*\b/g,
                          ""
                        );
                      } else {
                        media.caption = null;
                      }
                      console.log(that.state.likeCountList);
                      console.log(that.state.commentList);
                      media.likeCount = that.state.likeCountList[i].count;
                      media.likeStr = that.state.likeCountList[i].likeStr;
                      media.userLiked = that.state.likeCountList[i].userLiked;
                      media.comments = that.state.commentList[i];
                      media.comment = "";
                    });
                    that.setState({ mediaList: data, filteredMediaList: data });
                  },
                  (err) => console.log(err)
                )
                .catch((err) => console.log(err));
            });
          }
        },
        (err) => console.log(err)
      )
      .catch((err) => console.log(err));
  };

  openEditModalHandler = () => {
    console.log(this.state.likeCountList);
    console.log(this.state.commentList);
    this.setState({ editModalIsopen: !this.state.editModalIsopen });
  };

  closeEditModalHandler = () => {
    this.setState({
      editModalIsopen: !this.state.editModalIsopen,
      fullName: "",
    });
  };

  inputFullNameChangeHandler = (event) => {
    this.setState({ fullName: event.target.value });
  };

  updateHandler = () => {
    if (this.state.fullName === "") {
      this.setState({ fullNameRequired: "dispBlock" });
      return;
    } else {
      this.setState({ fullNameRequired: "dispNone" });
    }

    this.setState({
      editModalIsopen: !this.state.editModalIsopen,
      name: this.state.fullName,
      fullName: "",
    });
  };
  render() {
    if (!this.state.loggedIn) {
      return <Redirect to="/" />;
    }
    const { classes } = this.props;
    return (
      <div>
        <Header loggedIn={this.state.loggedIn} history={this.props.history} />
        <div className="info-section">
          <Avatar
            variant="circular"
            alt="Profile Picture"
            src={profilePic}
            className={classes.avatar}
          ></Avatar>
          <div className="profile-details">
            <div>
              <Typography variant="h4">{this.state.username}</Typography>
            </div>
            <div className="middle-line">
              <div>
                <Typography>
                  <span>Posts: </span>
                  {this.state.numOfPosts}
                </Typography>
              </div>
              <div>
                <Typography>
                  <span>Follows: </span>
                  {this.state.following}
                </Typography>
              </div>
              <div>
                <Typography>
                  <span>Followed By: </span>
                  {this.state.followers}
                </Typography>
              </div>
            </div>
            <div>
              <Typography variant="h6">
                <span>{this.state.name}</span>
                <Fab
                  size="medium"
                  color="secondary"
                  aria-label="edit"
                  className={classes.editIcon}
                  onClick={this.openEditModalHandler}
                >
                  <EditIcon />
                </Fab>
              </Typography>
            </div>
          </div>
        </div>
        <Modal
          open={this.state.editModalIsopen}
          onClose={this.closeEditModalHandler}
          className="edit-name-modal"
        >
          <div
            className={classes.editModalContent}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              position: "relative",
            }}
          >
            <FormControl className="modal-heading">
              <Typography variant="h4">Edit</Typography>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="fullName">Full Name</InputLabel>
              <Input
                id="fullName"
                type="text"
                onChange={this.inputFullNameChangeHandler}
              />
              <FormHelperText className={this.state.fullNameRequired}>
                <span className="required">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.updateHandler}
            >
              UPDATE
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(Profile);

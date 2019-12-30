import React, { useState, useRef, useEffect } from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Snackbar from "@material-ui/core/Snackbar"
import { green } from "@material-ui/core/colors"
import IconButton from "@material-ui/core/IconButton"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import CloseIcon from "@material-ui/icons/Close"
import ErrorIcon from "@material-ui/icons/Error"

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    marginBottom: "50px",
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
  field: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  coach: {
    marginBottom: "1rem",
  },
  cont: {
    position: "relative",
  },
  speech: {
    position: "absolute",
    right: 0,
    top: "2rem",
    width: "45%",
    [theme.breakpoints.down("sm")]: {
      fontSize: "6vw",
    },
  },
  [theme.breakpoints.up("md")]: {},
}))

function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default () => {
  const classes = useStyles()
  const coach = useStaticQuery(graphql`
    query MyQuery {
      file(relativePath: { eq: "images/coach.png" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  const quotes = ["Geaux Tigers", "We're coming"]
  const [quote, setQuote] = useState("")
  const [email, setEmail] = useState("")
  const [sucOpen, setSucOpen] = React.useState(false)
  const [errOpen, setErrOpen] = React.useState(false)
  const [currentQuote, setCurrentQuote] = useState(
    quotes[Math.floor(quotes.length * Math.random())]
  )
  useInterval(
    () => setCurrentQuote(quotes[Math.floor(quotes.length * Math.random())]),
    3000
  )
  function handleChange(event) {
    switch (event.target.name) {
      case "quote":
        setQuote(event.target.value)
        break
      case "email":
        setEmail(event.target.value)
        break
      default:
        break
    }
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setSucOpen(false)
    setErrOpen(false)
  }
  function ValidateEmail(mail) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true
    }
    alert("You have entered an invalid email address!")
    return false
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!ValidateEmail(email)) return
    if (quote.length > 140) {
      alert("Your quote is too long! Please keep it under 140 characters.")
      return
    } else if (!quote.length) {
      alert(
        "Your quote is empty! Please add a quote and keep it under 140 characters."
      )
      return
    }
    const url =
      "https://script.google.com/macros/s/AKfycby8jAV7CNUAJ6hQt2IkKHwbKwiPA0p0KrPpUc4Y18tw23X58kmb/exec"
    const quoteParam = `quote=${encodeURIComponent(quote)}`
    const emailParam = `email=${encodeURIComponent(email)}`
    const requestUrl = url + "?" + quoteParam + "&" + emailParam
    fetch(requestUrl).then(data => {
      if (data.status === 200) {
        setSucOpen(true)
        setQuote("")
        setEmail("")
      } else {
        setErrOpen(true)
      }
      console.log(data)
    })
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Container maxWidth="md">
        <Typography
          variant="subtitle1"
          component="h2"
          className={classes.centerText}
        >
          Show us your
        </Typography>
        <Typography variant="h1" component="h1" className={classes.centerText}>
          EAUX FACE
        </Typography>
        <div className={classes.cont}>
          <Img
            className={classes.coach}
            fluid={coach.file.childImageSharp.fluid}
            alt="A passionate Coach O"
          />
          <Typography variant="h2" component="h2" className={classes.speech}>
            {currentQuote}
          </Typography>
        </div>
        <form
          className={classes.root}
          data-netlify="true"
          name="submission"
          id="submission"
        >
          <TextField
            className={classes.field}
            label="Send us your quotes"
            multiline
            fullWidth
            rows="4"
            placeholder="If we like your quotes, this lil' coach might say them!"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            name="quote"
            onChange={handleChange}
            value={quote}
          />
          <TextField
            className={classes.field}
            label="Email Address"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            name="email"
            onChange={handleChange}
            value={email}
          />
          <Button variant="outlined" type="submit" onClick={handleSubmit}>
            SUBMIT
          </Button>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={sucOpen}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <SnackbarContent
            className={classes.success}
            message={
              <span className={classes.message}>
                <CheckCircleIcon className={classes.icon} />
                Submission recieved!
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>,
            ]}
          />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={errOpen}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <SnackbarContent
            className={classes.error}
            message={
              <span className={classes.message}>
                <ErrorIcon className={classes.icon} />
                Submission error! Please try again.
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>,
            ]}
          />
        </Snackbar>
      </Container>
    </React.Fragment>
  )
}

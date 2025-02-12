import { Link } from "react-router-dom";
import ApiModule from "./Api";
import { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import validate from "../tools/validator";
import handBagImg from "../assets/local_mall_black_24dp.svg";
import SubmitBtn from "./SubmitBtn";
import { green } from "@mui/material/colors";
import validator from "../tools/validator";
import {
  Avatar,
  Box,
  Container,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, ArrowRightSharp } from "@mui/icons-material";
import InputText from "./InputText";
function Register() {
  const Api = ApiModule();
  let submitBtnStyle = {
    background: "black",
    color: "white",
    padding: "1rem",
    fontSize: "1rem",
    witdh: "3rem",
  };

  let formElement = useRef(null); 
  let [error, setError] = useState("");
  let [success, setSuccess] = useState(""); 
  let [userData, setUserData] = useState();

  let [step, setStep] = useState(1);
  let navigate = useNavigate();
 
  let nextStep = function () {
    let formValid = formElement.current.reportValidity();
    if (!formValid) return; 
    setStep(2);
  };
  const [loading, setLoading] = useState(false);

  let submitHandler = function (e) {
    if (step === 1) return;
    e.preventDefault();
    setLoading(true);
    let formData = new FormData(formElement.current);
    let data = {};
    formData.forEach((value, key) => (data[key] = value));
    setUserData(data);
    Api.post("/user/registration", data)
      .then(successHandler)
      .catch(errorHandler);
  };

  let successHandler = () => {
    setSuccess(true);
  };

  let errorHandler = (a) => {
    let error = a.response.data.error;
    console.log(error);
    setError(error);
    setLoading(false);
  };
 
  return success ? (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      You are now registered! —{" "}
      <Link to="/login">
        {" "}
        <strong>Login here</strong>
      </Link>
    </Alert>
  ) : (
    <Container>
      <Box>
        <form
          onSubmit={submitHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "center",
            padding: "1rem",
          }}
          ref={formElement}
        >
          <Avatar src={handBagImg} sx={{ width: "10rem", height: "10rem" }} />
          <h1>Shop App</h1>
          {error ? (
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              {error}
            </Alert>
          ) : (
            ""
          )}
          <Box
            style={{
              display: step == 1 ? "flex" : "none",
              flexDirection: "column",
              flexWrap: "nowrap",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <InputText
              label="firstname"
              name="firstname"
              required
              margin="dense"
              lettersOnly
            />
            <InputText
              label="lastname"
              name="lastname"
              required 
              lettersOnly
              margin="dense"
            />
            <InputText
              label="username"
              name="username"
              required
              margin="dense"
              inputProps={{
                pattern: validator.username.pattern,
                minLength: validator.username.minLength,
                maxLength: validator.username.maxLength
              }}
              validationMessage={validator.username.msg}
              onInvalid={(e)=>{console.log(e)}}
            />
            <InputText
              label="password"
              name="password"
              type="password"
              required 
              margin="dense" 
              inputProps={{
                pattern: validator.password.pattern,
                minLength: validator.password.minLength,
                maxLength: validator.password.maxLength
              }}
              validationMessage={validator.password.msg} 
            />
            <Button
              style={{ marginTop: "1rem" }}
              variant="contained"
              onClick={() => nextStep()}
              type="submit"
            >
              Next <ArrowRightSharp />
            </Button>

            <h5>Have an account?</h5>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Sign in</Button>
            </Link>
          </Box>
          {step == 2 ? (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <InputText
                label="phone number"
                name="contact"
                required
                inputProps={{
                  pattern: validate.contact.pattern,
                  defaultValue: userData?.contact,
                }}
                margin="dense"
                helperText="+639xxxxxxxxx"
              />
              <InputText
                multiline
                label="address"
                name="address"
                required
                inputProps={{ defaultValue: userData?.address }}
                margin="dense"
                rows={4}
              />
              <Box>
                <Button
                  style={{ marginTop: "1rem" }}
                  disabled={loading}
                  variant="outlined"
                  onClick={() => setStep(1)}
                >
                  <ArrowBack />
                  Back
                </Button>
                <Button
                  style={{ marginTop: "1rem", marginLeft: "1rem" }}
                  variant="contained"
                  disabled={loading}
                  type="submit"
                >
                  Submit{" "}
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "primary",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Button>
              </Box>
            </Box>
          ) : (
            ""
          )}
        </form>
      </Box>
    </Container>
  );
}

export default Register;

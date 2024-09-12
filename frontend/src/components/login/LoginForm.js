import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Loading from "../loading";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErrors, setEmailErrors] = useState([]);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        let errors = [];
        if (e.target.value.length < 5) {
            errors.push("Email must be at least 5 characters long");
        }
        if (!e.target.value.includes("@")) {
            errors.push("Email must contain an @ symbol");
        }
        if (!e.target.value.includes(".")) {
            errors.push("Email must contain a . symbol");
        }
        if (errors.length > 0) {
            setEmailErrors(errors);
            if (!e.target.classList.contains("error-input")) {
                e.target.classList.remove("success-input");
                e.target.classList.add("error-input");
            }
        } else {
            setEmailErrors([]);
            if (e.target.classList.contains("error-input")) {
                e.target.classList.remove("error-input");
                e.target.classList.add("success-input");
            }
        }
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        let errors = [];
        if (e.target.value.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (e.target.value.length > 20) {
            errors.push("Password must be less than 20 characters long");
        }
        if (!e.target.value.match(/\d/)) {
            errors.push("Password must contain a number");
        }
        if (!e.target.value.match(/[A-Z]/)) {
            errors.push("Password must contain an uppercase letter");
        }
        if (!e.target.value.match(/[a-z]/)) {
            errors.push("Password must contain a lowercase letter");
        }
        if (!e.target.value.match(/[^a-zA-Z0-9]/)) {
            errors.push("Password must contain a special character");
        }
        if (errors.length > 0) {
            setPasswordErrors(errors);
            if (!e.target.classList.contains("error-input")) {
                e.target.classList.remove("success-input");
                e.target.classList.add("error-input");
            }
        } else {
            setPasswordErrors([]);
            if (e.target.classList.contains("error-input")) {
                e.target.classList.remove("error-input");
                e.target.classList.add("success-input");
            }
        }
        setPassword(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) {
            return;
        }
        if (emailErrors.length > 0 || passwordErrors.length > 0) {
            return;
        }
        setLoading(true);
        fetch(process.env.REACT_APP_API_URL + "auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password })
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(data => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong"
                });
            });
        }).then(data => {
            if (data.token === undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.error
                });
                return;
            }
            localStorage.setItem("poll-admin-token", data.token);
            window.location.href = "/admin";
        })
    };
    const handlePassShow = () => {
        setShowPassword(!showPassword);
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            <div className="error">
                {
                    emailErrors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))
                }
            </div>
            <div className="pass-box">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <button type="button" onClick={handlePassShow}>
                    <FontAwesomeIcon icon={showPassword ? faEyeLowVision : faEye} />
                </button>
            </div>
            <div className="error">
                {
                    passwordErrors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))
                }
            </div>
            <button type="submit">
                {
                    loading ? <Loading /> : "Login"
                }
            </button>
        </form>
    );
}

export default LoginForm;
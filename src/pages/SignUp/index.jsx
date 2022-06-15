import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Template from "../../containers/Template";
import { useAuth } from "../../hooks/useAuth";

import styles from "./SignUp.module.scss";
import Swal from "sweetalert2";

const SignUp = () => {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmationInputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.table({
      name: nameInputRef.current.value,
      age: ageInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
      confirmation: passwordConfirmationInputRef.current.value,
    });

    if (
      !nameInputRef.current ||
      !emailInputRef.current ||
      !passwordInputRef.current
    ) {
      return;
    }

    const name = nameInputRef.current.value.trim();
    const email = emailInputRef.current.value.trim();
    const password = passwordInputRef.current.value.trim();
    const password_confirmation =
      passwordConfirmationInputRef.current.value.trim();

    if (!name || !email || !password || !password_confirmation) {
      return;
    }

    if(password.length < 6) {
      return alert("A senha deve conter pelo menos 6 caracteres");
    }

    if (password_confirmation !== password) {
      return alert("A senha de confirmação deve ser igual a senha");
    }

    Swal.fire({
      title: "Deseja criar um usuário?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Sim",
      denyButtonText: `Não`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await signUp({ name, email, password });
          Swal.fire({
            position: "top-end",
            toast: true,
            icon: "success",
            title: "Usuário criado com sucesso",
            showConfirmButton: false,
            timer: 3000,
          });
        } catch (error) {
          alert("email ou senha inválidos");
        }

        navigate("/home");
      }
    });
  };

  return (
    <Template title="Cadastrar-se">
      <form className={styles.Form} onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          id="name"
          aria-describedby="name"
          placeholder="Digite seu nome"
          ref={nameInputRef}
        />
        <label htmlFor="age">Idade</label>
        <input
          type="number"
          id="age"
          min={0}
          aria-describedby="age"
          placeholder="Digite sua idade"
          ref={ageInputRef}
        />
        <label htmlFor="email">E-mail de Usuário</label>
        <input
          type="email"
          id="email"
          aria-describedby="email"
          placeholder="Digite seu email"
          ref={emailInputRef}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          placeholder="Digite sua senha"
          ref={passwordInputRef}
        />
        <label htmlFor="password_confirmation">Confirmação</label>
        <input
          type="password"
          id="password_confirmation"
          placeholder="Confirme sua senha"
          ref={passwordConfirmationInputRef}
        />
        <button type="submit">Cadastrar</button>
        <Link to="/"> voltar!</Link>
      </form>
    </Template>
  );
};

export default SignUp;

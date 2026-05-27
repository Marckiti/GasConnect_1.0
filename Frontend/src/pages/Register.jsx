import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authFirebase, dbFirebase } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleRegister = async (data) => {
    const { email, password, name } = data;

    try {
      const newUserFirebase = await createUserWithEmailAndPassword(
        authFirebase,
        email,
        password
      );

      const userRegister = newUserFirebase.user;

      if (userRegister) {
        await setDoc(doc(dbFirebase, "Users", userRegister.uid), {
          name: name,
          email: email,
          rol: "admin"
        });
      }

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="auth-container">
      <h1>Registro</h1>

      <form className="auth-form" onSubmit={handleSubmit(handleRegister)}>
        <div className="field">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="error">El nombre es obligatorio</span>}
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Tu correo"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="error">El correo es obligatorio</span>}
        </div>

        <div className="field">
          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              {...register("password", { required: true, minLength: 6 })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <span className="error">Mínimo 6 caracteres</span>
          )}
        </div>

        <button type="submit" className="btn-primary">
          Registrarse
        </button>
      </form>

      <NavLink to="/login" className="auth-link">
        ¿Ya tienes cuenta? Inicia sesión
      </NavLink>
    </main>
  );
};

export default Register;

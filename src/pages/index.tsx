import React, { useState, useEffect, useContext } from "react";
import TextField from '@mui/material/TextField';
import Image from "next/image";
import { Card, CardContent, Button } from '@mui/material';
import User from "../../models/User";
import { useFormik } from "formik";
import loginSchema from "@/validation/loginSchema";
import { authUser } from "@/services/auth";
import ErrorMessage from "../../components/error-message";
import { useRouter } from 'next/router';
import { setLocalStorage } from "@/services/common";




export default function Index() {


  const router = useRouter();

  const [authData, setAuthData] = useState({ username: "", password: "" });
  const [logo, setLogo] = useState<string>('logo');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginForm, setIsLoginForm] = useState<boolean>(false);
  const [errors, setError] = useState<any>();

  const initialValues: User = {
    username: 'Admin',
    password: '12345'
  };


  const handleSubmit = async (user: User) => {

    try {

      setLoading(true);

      const resp: any = await authUser({ username: user.username, password: user.password });

      if (resp.status == 200) {

        setLoading(false);
        localStorage.setItem("token", resp.data.token);
        localStorage.setItem("userData", JSON.stringify(resp.data.user));
        router.push('/dashboard');

      } else if (resp.status == 400) {
        setError(resp?.errors);        
        setLoading(false);
      }

    } catch (err: any) {
      setLoading(false);      
      setError(err.response.data.message);

      setTimeout(() => {
        setError(null);
      }, 3000);
    }


  };

  const handleReset = () => {
    formik.setValues(initialValues); // Reset form values to initial state
    formik.setErrors({}); // Clear any form errors
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: handleSubmit,
    onReset: handleReset
  });

  const toggleLoginHandler = (str: string) => {
    setIsLoginForm(prevState => !prevState);
    setLogo(str);
    setLocalStorage('appLogo', str);
  };


  return (
      <div className='login-form-wrapper'>

        {
          !isLoginForm &&
          <div className="three-companies">
            <div>
              <Card variant="outlined">
                <Image src={require('../../public/images/logo.svg')} alt="Description of the image" className="responsive-img center" onClick={() => toggleLoginHandler('logo')} />
              </Card>
              {false && <Card variant="outlined">
                <Image src={require('../../public/images/agro.png')} alt="Description of the image" className="responsive-img center" onClick={() => toggleLoginHandler('agro')} />
              </Card>}
            </div>
            {false && <div>
              <Card variant="outlined">
                <Image src={require('../../public/images/bombay.png')} alt="Description of the image" className="responsive-img center" onClick={() => toggleLoginHandler('bombay')} />
              </Card>
              <Card variant="outlined">
                <Image src={require('../../public/images/meghna.png')} alt="Description of the image" className="responsive-img center" onClick={() => toggleLoginHandler('meghna')} />
              </Card>
            </div>}
          </div>
        }


        {isLoginForm &&
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Image src={require(`../../public/images/${logo}.png`)} alt="Description of the image" className="responsive-img center" />

              <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className='form'>

                {errors && <div className="error"><ErrorMessage message={errors} /></div>}

                <TextField
                  type="text"
                  label="Username"
                  name="username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />


                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Button type='submit' variant="contained">{loading ? "Login..." : "Login"}</Button>
              </form>
            </CardContent>
          </Card>
        }

      </div>
  );
}



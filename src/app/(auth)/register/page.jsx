"use client"
// pages/auth/register.js
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      usertype: '',
      phone: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      usertype: Yup.string().oneOf(['patient', 'doctor']).required('Required'),
      phone: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post('/api/register', values);
        if (res.data.success) {
          // await signIn('credentials', {
          //   redirect: false,
          //   email: values.email,
          //   password: values.password,
          // });
          toast.success("User Created")
          // Handle successful registration
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="w-screen h-screen bg_color flex md:flex-row flex-col">
      <div className="md:w-1/2 w-full flex justify-center items-center">
        <h3>Make you'r own consulting Area</h3>
      </div>
      <Container maxWidth="" className="flex justify-center items-center min-h-screen mx-auto md:w-1/2 w-full bg-white/40 backdrop-blur-md shadow-md md:rounded-l-[3rem] md:rounded-none rounded-[3rem] ">
      <form onSubmit={formik.handleSubmit} className=" md:w-3/4  p-8 rounded-lg  w-full">
        <Typography variant="h5" className="mb-4">Register</Typography>
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          className="mb-4 "
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          className="mb-4 "
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          className="mb-4 "
        />
        <TextField
          fullWidth
          id="usertype"
          name="usertype"
          label="User Type"
          select
          value={formik.values.usertype}
          onChange={formik.handleChange}
          error={formik.touched.usertype && Boolean(formik.errors.usertype)}
          helperText={formik.touched.usertype && formik.errors.usertype}
          className="mb-4 "
        >
          <MenuItem value="patient">Patient</MenuItem>
          <MenuItem value="doctor">Doctor</MenuItem>
        </TextField>
        <TextField
          fullWidth
          id="phone"
          name="phone"
          label="Phone Number"
          type='number'
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          className="mb-4 "
        />
        <Button variant="contained" fullWidth type="submit" className="mb-4 bg-main hover:bg-[#CF92D3]">
          Register
        </Button>
        <Button variant="contained" fullWidth onClick={() => signIn('google')} className="mb-4">
          Register with Google
        </Button>
      </form>
    </Container>
    </div>
    
  );
};

export default RegisterPage;

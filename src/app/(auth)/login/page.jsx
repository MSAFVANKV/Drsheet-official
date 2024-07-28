"use client"

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { TextField, Button, Container, Typography } from '@mui/material';

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (!res.error) {
        // Handle successful login
      }
    },
  });

  return (
    <Container maxWidth="xs" className="flex justify-center items-center min-h-screen">
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded shadow-md w-full">
        <Typography variant="h5" className="mb-4">Login</Typography>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          className="mb-4"
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
          className="mb-4"
        />
        <Button color="primary" variant="contained" fullWidth type="submit" className="mb-4">
          Login
        </Button>
        <Button variant="contained" fullWidth onClick={() => signIn('google')} className="mb-4">
          Login with Google
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;

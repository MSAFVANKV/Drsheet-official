"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { TextField, Button, Container, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
console.log(session,'session');
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        if (res?.error) {
          toast.error("Credential Error");
          if (res.url) router.replace("/");
        } else {
          toast.success("Successful Login");
          router.replace("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-screen h-screen bg_color">
      <Container
        maxWidth="xs"
        className="flex justify-center items-center min-h-screen"
      >
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white/40 backdrop-blur-md p-8 rounded shadow-md w-full"
        >
          <Typography variant="h5" className="mb-4">
            Login
          </Typography>
          <TextField
            fullWidth
            id="email"
            name="email"
            type="email"
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
          <Button
            color="inherit"
            variant="outlined"
            fullWidth
            disabled={loading}
            type="submit"
            className="mb-4 border-main text-main hover:border-main"
          >
            {loading ? <CircularProgress size={24}/> : "Login"}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            disabled={loading}
            onClick={() => signIn("google")}
            className="mb-4 border-main text-main hover:border-main"
          >
            Login with Google
          </Button>
          <span className="text-slate-400 text-sm">
            Don't have an account? <Link href={`/register`}>Register</Link>
          </span>
        </form>
      </Container>
    </div>
  );
};

export default LoginPage;

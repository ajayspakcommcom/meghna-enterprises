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
import dynamic from 'next/dynamic';

interface Post {
  id: number;
  title: string;
}

const Header = dynamic(() => import('../../components/header/index'));


export default function Index() {

  const router = useRouter();
  const [data, setData] = useState<Post[] | null>(null);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/');
    }

  }, []);

  const goToPage = (url: string) => {
    router.push(`${url}`);
  };

  return (
    <>
      <Header />
      <div className='master-wrapper'>
        <Card>
          <CardContent>

            <table>
              <tbody>
                <tr>
                  <td>
                    <Button type='submit' variant="contained" onClick={() => goToPage('/seller')}>Seller</Button>
                  </td>
                  <td>
                    <Button type='submit' variant="contained" onClick={() => goToPage('/contract')}>Buyer</Button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <Button type='submit' variant="contained">Template</Button>
                  </td>
                </tr>
              </tbody>
            </table>

          </CardContent>
        </Card>
      </div>
    </>
  );
}



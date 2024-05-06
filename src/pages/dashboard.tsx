import React, { useContext, useEffect, useState } from 'react';
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

    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);


  return (
    <>
      {data ? (
        <>
          <Header />
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}



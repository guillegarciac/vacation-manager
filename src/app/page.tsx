'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  
  useEffect(() => {
    if (status != "authenticated") {
      router.push("/login");
    }
  }, [status, router])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Typography variant="h5" gutterBottom>
          Get started by editing <code className={styles.code}>src/app/page.tsx</code>
        </Typography>
        <div>
          <Button variant="contained" color="primary">
            Check out Vercel
          </Button>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Docs -&gt;
              </Typography>
              <Typography variant="body2">
                Find in-depth information about Next.js features and API.
              </Typography>
            </CardContent>
            <Button variant="outlined" href="https://nextjs.org/docs" target="_blank">Learn More</Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Learn -&gt;
              </Typography>
              <Typography variant="body2">
                Learn about Next.js in an interactive course with quizzes!
              </Typography>
            </CardContent>
            <Button variant="outlined" href="https://nextjs.org/learn" target="_blank">Start Learning</Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Templates -&gt;
              </Typography>
              <Typography variant="body2">
                Explore starter templates for Next.js.
              </Typography>
            </CardContent>
            <Button variant="outlined" href="https://vercel.com/templates" target="_blank">Explore Templates</Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Deploy -&gt;
              </Typography>
              <Typography variant="body2">
                Instantly deploy your Next.js site to a shareable URL with Vercel.
              </Typography>
            </CardContent>
            <Button variant="outlined" href="https://vercel.com/new" target="_blank">Deploy Now</Button>
          </Card>
        </Grid>
      </Grid>
    </main>
  );
}

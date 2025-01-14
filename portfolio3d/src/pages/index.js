'use client'
import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Scene from "@/components/scene";
import LoadingScreen from "@/components/3d/Loader";
import { useState, useEffect, Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 0.99) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500); // Give a small delay after reaching 100%
          return 1;
        }
        // Gradually increase progress, slower towards the end
        const increment = Math.max(0.01, (1 - prevProgress) * 0.1);
        return Math.min(prevProgress + increment, 1);
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Track Scene loading progress
  const handleProgress = (value) => {
    // Only update if the new progress is higher than the current one
    setProgress((prev) => Math.max(prev, value));
  };

  if (isLoading) {
    return <LoadingScreen progress={progress} />;
  }
  
  return (
    <>
      <Head>
        <title>7K</title>
        <meta name="description" content="7K Website Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <Suspense fallback={<LoadingScreen progress={progress} />}>
            <Scene onProgress={handleProgress} />
          </Suspense>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
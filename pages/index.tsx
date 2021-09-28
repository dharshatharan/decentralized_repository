import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useIPFS } from '../hooks/UseIPFS';
import { useState } from 'react';

const Home: NextPage = () => {
  const ipfs = useIPFS();
  const [images, setImages] = useState<string[]>([]);
  const [imagesIPFS, setImagesIPFS] = useState<string[]>([]);


  const uploadPhotoIPFS = async (file: File) => {
    if (ipfs) {
      const date = new Date()
      const data = {
        createdAt: date,
        updatedAt: date,
        title: "Test",
        description: "Test Description",
      }

      const dataResults = await ipfs.addAll(
        [
          { path: 'image', content: file },
          { path: 'metadata.json', content: JSON.stringify(data) },
        ],
        { wrapWithDirectory: true }
      )

      for await (const result of dataResults) {
        if (result.path === '') {
          setImagesIPFS(oldImages => [
            ...oldImages,
            "https://ipfs.io/ipfs/" + result.cid + "/image"
          ])
        }
      }
    }
  };

  const uploadPhoto = async (file: File) => {
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-url?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (upload.ok) {
      setImages(oldImages => [
        ...oldImages,
        upload.url + filename
      ])
    } else {
      console.error('Upload failed.');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Repository</title>
        <meta name="description" content="A Repository to store Images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <input
          onChange={(e: any) => {
            const files = e.target.files;
            for (var i = 0; i < files.length; i++) {
              uploadPhoto(files[i]);
              uploadPhotoIPFS(files[i]);
            }
          }}
          type="file"
          accept="image/png, image/jpeg"
          className="fixed top-10 left-10"
          multiple
        />
        <div className="flex flex-col text-center w-full prose lg:prose-xls max-w-screen-2xl">
          <h1>Centralized vs Decentralized <br /> Image Repositories</h1>
          <p>We&apos;re comparing two repository stratergies here. Centralized and Decentralized.</p>
          <div className="w-full grid grid-cols-2 divide-x divide-gray-500 h-96">
            <div className="w-full p-2">
              <h2>Centralized</h2>
              <div className="flex justify-center">
                <div className="grid grid-flow-col auto-cols-max gap-10">
                  {images.map((image) => {
                    return (
                      <div key={image} className="w-80 max-w-xs flex flex-col">
                        <Image src={image} alt={image} width={300} height={300} objectFit="cover" />
                        <a href="image" target="_blank" className="break-all">{image}</a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="w-full p-2">
              <h2>Decentralized</h2>
              <div className="flex justify-center">
                <div className="grid grid-flow-col auto-cols-max gap-10">
                  {imagesIPFS.map((image) => {
                    return (
                      <div key={image} className="w-80 max-w-xs flex flex-col">
                        <Image src={image} alt={image} width={300} height={300} objectFit="cover" />
                        <a href="image" target="_blank" className="break-all">{image}</a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

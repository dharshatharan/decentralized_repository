import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { gql, useQuery } from '@apollo/client';

const AllImagesQuery = gql`
  query AllImagesQuery($imagesFirst: Int, $imagesAfter: Int) {
    images(first: $imagesFirst, after: $imagesAfter) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
          title
          description
          url
        }
      }
    }
  }
`

const Home: NextPage = () => {
  const { data, error, loading, fetchMore } = useQuery(AllImagesQuery, {
    variables: { first: 2 },
  });

  if (loading) return <p>Loading......</p>;

  if (error) return <p>Oops, something went wrong {error.message}</p>;

  console.log(data)

  const { hasNextPage, endCursor } = data.images.pageInfo;

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Repository</title>
        <meta name="description" content="A Repository to store Images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div className="container mx-auto max-w-5xl my-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.images.edges.map(({ node }: any) => (
              node.title
            ))}
          </div>
          {hasNextPage ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded my-10"
              onClick={() => {
                fetchMore({
                  variables: { after: endCursor },
                  updateQuery: (prevResult: any, { fetchMoreResult }: any) => {
                    fetchMoreResult.links.edges = [
                      ...prevResult.links.edges,
                      ...fetchMoreResult.links.edges,
                    ];
                    return fetchMoreResult;
                  },
                });
              }}
            >
              more
            </button>
          ) : (
            <p className="my-10 text-center font-medium">
              Youve reached the end!
            </p>
          )}
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home

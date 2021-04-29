import { GetServerSideProps, GetStaticProps, NextPageContext } from 'next'
import Link from 'next/link'
import useSWR from 'swr'

// const fetcher = (...args) => fetch(...args).then(res => res.json())
// getServerSideProps, getStaticProps 차이점 테스트
function Blog({ posts, rand }) {
  // const fetcher = (args: string) => fetch(args).then((res) => res.json())
  // const { data, error } = useSWR('https://jsonplaceholder.typicode.com/users/1', fetcher)
  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>
  return (
    <>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Link href="/">
        <a className="nav-link">뒤로가기</a>
      </Link>
    </>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const rand = Math.floor(Math.random() * 10)
//   const res = await fetch(`https://jsonplaceholder.typicode.com/users/${rand}`)
//   const posts = await res.json()

//   return {
//     props: {
//       posts,
//       rand,
//     },
//     revalidate: 1,
//   }
// }

export const getServerSideProps: GetServerSideProps = async () => {
  const rand = Math.floor(Math.random() * 10) + 1
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${rand}`)
  const posts = await res.json()

  return {
    props: {
      posts,
      rand,
    },
  }
}
// Blog.getInitialProps = async (ctx) => {
//   const rand = Math.floor(Math.random() * 10) + 1
//   const res = await fetch(`https://jsonplaceholder.typicode.com/users/${rand}`)
//   const posts = await res.json()
//   console.log('tsaetsetestse')

//   return { posts }
// }

export default Blog

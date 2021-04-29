import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState('test')

  useEffect(() => {
    // Always do navigations after the first render
    router.push('/qqq/123?counter=10', undefined, { shallow: true })
  }, [])

  useEffect(() => {
    // console.log(router.query.counter)
    fetch(`https://jsonplaceholder.typicode.com/users/${router.query.counter}`)
      .then((res) => res.json())
      .then((res) => setData(res))
  }, [router.query.counter])

  return <p>Post: {JSON.stringify(data)}</p>
}

export default Post

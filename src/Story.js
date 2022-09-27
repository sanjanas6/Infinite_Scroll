import React, { useEffect, useState } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from 'react-router-dom';
import './PostList.css'

export default function PostList({setPostsForFilter}) {
   
    const [postList , setPostList] = useState([])
    const [pageCount , setPageCount] = useState(0)  
    const [searchText , setSearchText] = useState('')
    
    const getPosts = async ()=>{
        const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageCount}`)
        const data = await res.json()
        
        setPostList((prevState)=> {
            return [...prevState , ...data.hits]
        })

        setPageCount((prevState)=>{
            return prevState + 1
        })
    }
  
      
    useEffect(()=>{ 
       getPosts()
       const timer = setInterval(getPosts ,10000 )
       return ()=> clearInterval(timer)
    }  , [])

  return (

    <div className='posts'>
        <input type='text' placeholder='Search by title or author name' onChange={(e)=> setSearchText(e.target.value)}  />
        <h1>{pageCount}</h1>
        <ul>
        <InfiniteScroll
          dataLength={postList.length}
          next={getPosts}
          hasMore={true}
          loader={
            <h1>Loading...</h1>
          }
        >
        {postList.length > 0 &&  postList.filter((post)=>{
            if(searchText === ''){
                return post
            }else if(post.title.toLowerCase().includes(searchText.toLowerCase()) || post.author.toLowerCase().includes(searchText.toLowerCase()) ) {
                return post
            }
        }).map((post)=>(
          
           <li key={Math.random()*10000} > 
           <Link to={`/posts/${post.objectID}`} state={{post : post}} className='link'  >
              <h1>{post.title}</h1> 
            </Link>
              <p>Author : <a href={post.url} className='link' >{post.author}</a> </p>
              <h5>Tags</h5>
              <ul>
                {post._tags.map((tag)=> (
                    <li key={Math.random()*10000} >
                        <p>{tag}</p>
                    </li>
                ))}
              </ul>
              <p>{post.created_at}</p>
            </li>
            
        )) }
        </InfiniteScroll>
        </ul>
    </div>
  )
}
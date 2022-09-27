import React, { useState, useEffect, useRef } from "react";
// import axios from 'axios'
// import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

export default function Stories() {
  const [list, setList] = useState([]);
  // const [pageCount , setPageCount] = useState(1)
  const pageCount = useRef(0);
  const [searchTitle, setSearchTitle] = useState("");
  let API = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0${pageCount.current}`;

  const fetchData = async () => {
    console.log(pageCount);
    const res = await fetch(API);
    const data = await res.json();

    setList((prevState) => {
      return [...prevState, ...data.hits];
    });

    pageCount.current++;
    // setPageCount((prevState)=>{
    //     return prevState + 1
    // })
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // const loadMore = () => {
  //     setPageCount((prevState)=>{
  //         return prevState + 1
  //     })
  //   };
  // window.onscroll = function () {
  //     if (
  //       window.scrollY + window.innerHeight >= // when it is reaching to end
  //       document.documentElement.scrollHeight
  //     ) {
  //       loadMore(); // i'm calling this function
  //     }
  //   };

  return (
    <div className='Stories'>
      <h1
        style={{
          width: "90%",
          height: "25px",
          // marginRight: "50px",
          marginLeft: "100px",
          alignItems: "center",
        }}
      >
        Search Filter
      </h1>
      <input
        style={{
          width: "90%",
          height: "25px",
          // marginRight: "50px",
          marginLeft: "100px",
          alignItems: "center",
        }}
        type='text'
        placeholder='Search...'
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <h1>{pageCount.current}</h1>
      <InfiniteScroll
        dataLength={list.length}
        next={fetchData}
        hasMore={true}
        loader={<h2>Loading...</h2>}
      >
        {list &&
          list.length > 0 &&
          list
            .filter((story) => {
              if (searchTitle === "") {
                return story;
              } else if (
                story.title.toLowerCase().includes(searchTitle.toLowerCase())
              ) {
                return story;
              } else if (
                story.author.toLowerCase().includes(searchTitle.toLowerCase())
              ) {
                return story;
              }
            })
            .map((story) => {
              return (
                <ul>
                  <li
                    style={{
                      padding: "5px",
                      border: "1px solid green",
                      borderRadius: "10px",
                      backgroundColor: "#ADD8E6",
                      margin: "auto",
                      marginTop: "10px",
                      width: "100%",
                    }}
                  >
                    <h4>Title: {story.title} </h4>
                    <p>
                      Author: <a href={story.url}>{story.author}</a>
                    </p>
                    <p>Created At: {story.created_at}</p>
                    <ul>
                      {story._tags.map((tag) => (
                        <li key={Math.random() * 10000}>
                          <p>{tag}</p>
                        </li>
                      ))}
                    </ul>
                    <p>By: {story.author}</p>

                    {/* <p>Tags: {story._tags}</p> */}
                  </li>
                </ul>
              );
            })}
      </InfiniteScroll>
    </div>
  );
}

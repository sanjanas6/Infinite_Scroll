import React, { useState , useEffect } from 'react'
// import axios from 'axios'

export default function Stories() {

    const [list , setList] = useState([])
    const [pageCount , setPageCount] = useState(1)
    const [searchTitle, setSearchTitle] = useState("");
    
    let API = `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0${pageCount}`;  
    
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(API);  //retun promise
            const data = await res.json();
            
            setList((prevState)=> {
                return [...prevState ,...data.hits]
            })
            console.log(list);
        }
        fetchData();
        // const interval = setInterval (()=>{
        //     fetchData() 
        // }, 2000)
        // return ()=> clearInterval(interval);
        
    },[pageCount]);

    const loadMore = () => {
        setPageCount((prevState)=>{
            return prevState + 1
        })
      };
    window.onscroll = function () {
        if (
          window.scrollY + window.innerHeight >= // when it is reaching to end
          document.documentElement.scrollHeight
        ) {
          loadMore(); // i'm calling this function
        }
      };

  return (
    <div className='Stories'>
    <h1 style={{ width: "90%", 
        height: "25px",
        // marginRight: "50px",
        marginLeft: "100px",
        alignItems: "center"}}>Search Filter</h1>
    <input
    style={{
        width: "90%", 
        height: "25px",
        // marginRight: "50px",
        marginLeft: "100px",
        alignItems: "center"
    }}
    type="text"
    placeholder='Search...'
    onChange={(e) => setSearchTitle(e.target.value)}
    />
    <h1>{pageCount}</h1>
    <div>
        {/* {list && list.length>0 && list.map((story) =>{ */}
        {list
         .filter((value) => {
            if(searchTitle === ""){
                return value;
            }else if (
                value.title.toLowerCase().includes(searchTitle.toLowerCase()))
            {
                return value;
            }else if (
                value.author.toLowerCase().includes(searchTitle.toLowerCase()))
            {
                return value;
            }
            })
         .map((story) =>{
            return (
        <ul>
          <div key={story.title}
          style={{
            padding: "5px",
            border: "1px solid green",
            borderRadius: "10px",
            backgroundColor: "#ADD8E6",
            margin: "auto",
            marginTop: "10px",
            width: "100%"
          }}
          >
            <h4>Title: {story.title} </h4>
            <p>Author: <a href="{story.url}">{story.url}</a></p>  
            <p>Created At: {story.created_at}</p>
            <p>Tags: {story._tags}</p>
            <p>Author: {story.author}</p>
            
           </div>
        </ul>
          );
         })}
         </div>
    </div>
  )
}


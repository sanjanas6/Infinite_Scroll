import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import "./NewsList.css";

export default function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const pageCount = useRef(0);
  const [searchNews, setsearchNews] = useState("");

  const limitReach = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  let filteredPosts = newsList;

  if (searchNews.length > 0) {
    const newPosts = [...newsList];
    filteredPosts = newPosts.filter(
      (story) =>
        story.title.toLowerCase().includes(searchNews.toLowerCase()) ||
        story.author.toLowerCase().includes(searchNews.toLowerCase())
    );
  }

  //Data Fetching
  const fetchdata = async () => {
    let data;
    if (limitReach.current === false) {
      try {
        const res = await fetch(
          `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageCount.current}`
        );
        data = await res.json();
      } catch (error) {
        setError("Failed to Fetch Data From API");
      }
    }

    //Show Done if Data Fetched
    if (limitReach.current === true) {
      setHasMore(false);
    }

    if (data.hits.length === 0) {
      limitReach.current = true;
      setHasMore((prevState) => {
        return !prevState;
      });
    }

    if (limitReach.current === false) {
      setNewsList((prevState) => {
        return [...prevState, ...data.hits];
      });
    }

    pageCount.current++;
  };

  useEffect(() => {
    fetchdata();
    const interval = setInterval(fetchdata, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='Stories'>
        <h1>News Website</h1>
      <input
        type='text'
        placeholder='Search by title or author name'
        onChange={(e) => setsearchNews(e.target.value)}
        value={searchNews}
      />
      <h1>{pageCount.current}</h1>
      <ul>
        {error ? (
          <h1>{error}</h1>
        ) : (
          <InfiniteScroll
            dataLength={newsList.length}
            next={fetchdata}
            hasMore={hasMore}
            loader={filteredPosts.length > 0 && <h1>Loading...</h1>}
            endMessage={
              <p>You have gone through all the news</p>
            }
          >
            {filteredPosts.length === 0 ? (
              <h1>Not found</h1>
            ) : (
              filteredPosts.map((story) => (
                <li key={Math.random() * 10000}>
                  <Link
                    to={`/posts/${story.objectID}`}
                    state={{ post: story }}
                    className='link'
                  >
                    <h1>{story.title}</h1>
                  </Link>
                  <p>
                    Author :
                    <a href={story.url} className='link'>
                      {story.author}
                    </a>
                  </p>
                  <h5>Tags</h5>
                  <ul>
                    {story._tags.map((tag) => (
                      <li key={Math.random() * 10000}>
                        <p>{tag}</p>
                      </li>
                    ))}
                  </ul>
                  <p>{story.created_at}</p>
                </li>
              ))
            )}
          </InfiniteScroll>
        )}
      </ul>
    </div>
  );
}

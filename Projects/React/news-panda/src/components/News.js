import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";
import Loading from "./Loading";


const News = ({ API_KEY, country, pagesize, category, updateProgress }) => {
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [serverNotFound, setServerNotFound] = useState(false);



  const loadNews = async () => {
    updateProgress(15);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}&page=${page}&pagesize=${pagesize}`;
    console.log(url)
    setLoading(true);
    let data = await fetch(url);
    updateProgress(40);
    if (data.status === 429) {
      setTotalResults(0);
      setLoading(false);
      setServerNotFound(true);
      updateProgress(70);
    } else {
      let parsedData = await data.json();
      updateProgress(70);
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
    }
    console.log(totalResults);
    updateProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalize(category)} - NewsPanda`;
    loadNews();
    // eslint-disable-next-line
  }, []);


  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${country
      }&category=${category}&apiKey=${API_KEY}&page=${page + 1
      }&pagesize=${pagesize}`;
    setPage((prevPage)=>prevPage+1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  };

  return (
    <>

      {serverNotFound === true ? (
        <div className="container px-3 my-5" style={{ maxWidth: "60vw" }}>
          <div className="card text-white bg-dark ">
            <div className="card-header pl-4">#Server Not Found</div>
            <div className="card-body text-center">
              <h5 className="card-title ">Opps...</h5>
              <p className="card-text ">No News Available Right Now,</p>
              <p className="card-text ">Please try after some time...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="container my-8">
          <h2 className="text-center my-4">
            NewsPanda - Top {capitalize(category)} Headlines
          </h2>
          {loading && <Loading />}
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length !== totalResults}
            loader={<Loading />}
          >
            {
              <div className="container">
                <div className="row ">
                  {articles.map((element) => {
                    return (
                      <div className="col-md-4 p-2" key={element.url}>
                        <NewsItem
                          title={element.title ? element.title : ""}
                          description={
                            element.description ? element.description : ""
                          }
                          urlToImage={element.urlToImage}
                          newsurl={element.url}
                          author={element.author}
                          sources={element.source.name}
                          date={element.publishedAt} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          </InfiniteScroll>
        </div>
      )}
    </>
  )
}

News.defaultProps = {
  country: "in",
  pagesize: 9,
  category: "general"
};
News.propTypes = {
  country: PropTypes.string,
  pagesize: PropTypes.number,
  category: PropTypes.string,
};

export default News
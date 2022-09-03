import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    ["sw-species"],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // 초기 url로 시작해서 pageParam 값으로 fetchUrl을 실행한다.
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined, // 이전페이지(lastPage) 의 다음프로퍼티를 불러와 새 페이지 데이터가 있을 때마다 PageParam에 지정해준다. SWAPI에서 지정한 대로 함수의 값이 null인 경우에는 undefined를 둔다. 함수 값이 지정되지 않으면 hasNextPage의 값도 거짓이 된다.
    }
  );

  if (isLoading) return <h3 className="loading">Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    );

  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
      {isFetching && <h3 className="loading">Loading...</h3>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) =>
          pageData.results.map((species) => (
            <Species
              key={species.name}
              name={species.name}
              language={species.language}
              averageLifespan={species.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}

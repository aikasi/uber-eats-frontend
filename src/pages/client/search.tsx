import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return history.replace("/");
    }
    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [page]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          type="search"
          name="searchTerm"
          id="search"
          placeholder="Search restaurants..."
        />
      </form>

      <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10">
        {data?.searchRestaurant.restaurants?.map((restaurant, index) => (
          <Restaurant
            key={index}
            id={restaurant.id + ""}
            coverImg={restaurant.coverImg}
            name={restaurant.name}
            categoryName={restaurant.category?.name}
          />
        ))}
      </div>

      <div className=" grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10 ">
        {page > 1 ? (
          <button
            onClick={onPrevPageClick}
            className=" focus:outline-none font-medium text-2xl"
          >
            &larr;
          </button>
        ) : (
          <div></div>
        )}
        <span>
          page {page} pf {data?.searchRestaurant.totalPages}
        </span>
        {page !== data?.searchRestaurant.totalPages ? (
          <button
            onClick={onNextPageClick}
            className=" focus:outline-none font-medium text-2xl"
          >
            &rarr;
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

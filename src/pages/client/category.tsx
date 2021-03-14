import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
    AllCategoriesOutput {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

interface IFormProps {
  searchTerm: string;
}

export const Category = () => {
  const [page, setPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    }
  );

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
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
        <title> {params.slug} | Uber Eats</title>
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
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sx mx-auto">
            {data?.AllCategoriesOutput.categories?.map((cateogory, index) => (
              <Link key={index} to={`/category/${cateogory.slug}`}>
                <div className="flex flex-col items-center cursor-pointer group">
                  <div
                    key={index}
                    className="w-16 h-16 bg-cover rounded-full  group-hover:bg-gray-200"
                    style={{ backgroundImage: `url(${cateogory.coverImg})` }}
                  ></div>
                  <span className=" mt-1 text-sm text-center font-bold">
                    {cateogory.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-10">
            {data?.category.restaurants?.map((restaurant, index) => (
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
              page {page} pf {data?.category.totalPages}
            </span>
            {page !== data?.category.totalPages ? (
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
      )}
    </div>
  );
};

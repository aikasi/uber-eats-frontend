/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: category
// ====================================================

export interface category_category_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface category_category_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: category_category_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface category_category_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface category_category {
  __typename: "CateogryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: category_category_restaurants[] | null;
  category: category_category_category | null;
}

export interface category_AllCategoriesOutput_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface category_AllCategoriesOutput {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: category_AllCategoriesOutput_categories[] | null;
}

export interface category {
  category: category_category;
  AllCategoriesOutput: category_AllCategoriesOutput;
}

export interface categoryVariables {
  input: CategoryInput;
}

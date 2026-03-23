import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.pokemontcg.io/v2/',
  }),
  endpoints: (builder) => ({
    getCards: builder.query({
        query: ({ name = '', type = '', page = 1 }) => {
        let query = []

        if (name) query.push(`name:${name}`)
        if (type) query.push(`types:${type}`)

        return `cards?page=${page}&pageSize=20&q=${query.join(' ')}`
        },
    }),
  }),
})

export const {useGetCardsQuery}=pokemonApi
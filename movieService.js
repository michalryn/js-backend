import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
    responseType: 'json',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    }
})

export async function search(type, searchText, page) {
    const { data } = await axiosInstance({
        url: `/search/${type}?api_key=${process.env.API_KEY}&language=en-US&query=${searchText}&page=${page}&include_adult=false`,
        method: 'get'
    });

    return data
}

export async function trending(page) {
    const { data } = await axiosInstance({
        url: `/trending/all/day?api_key=${process.env.API_KEY}&page=${page}`,
        method: 'get'
    });
    return data
}

export async function movies(page, genres) {
    const { data } = await axiosInstance({
        url: `/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate&with_genres=${genres}`,
        method: 'get'
    })
    return data
}

export async function genres(genre) {
    const { data } = await axiosInstance({
        url: `/genre/${genre}/list?api_key=${process.env.API_KEY}&language=en-US`,
        method: 'get'
    })
    return data
}

export async function series(page, genres) {
    const { data } = await axiosInstance({
        url: `/discover/tv?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate&with_genres=${genres}`,
        method: 'get'
    })
    return data
}

export async function details(mediaType, id) {
    const { data } = await axiosInstance({
        url: `/${mediaType}/${id}?api_key=${process.env.API_KEY}&language=en-US`,
        method: 'get'
    })
    return data
}

export async function fetchVideo(mediaType, id) {
    const { data } = await axiosInstance({
        url: `/${mediaType}/${id}/videos?api_key=${process.env.API_KEY}&language=en-US`,
        method: 'get'
    })
    return data
}

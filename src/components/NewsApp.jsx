import React, { useState } from 'react'
import Card from './Card'
import useSWR from 'swr'

const fetcher = async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.')
        error.info = await response.json()
        error.status = response.status
        throw error
    }
    return await response.json()
};

const NewsApp = () => {
    const apiUrl = import.meta.env.VITE_NEWS_API
    const [currentPage, setCurrentPage] = useState(1) // State for current page
    const pageSize = 10; // Number of articles per page
    const [searchData, setSearchData] = useState('') // State for search input
    
    console.log(apiUrl)
    const { data, error, mutate, isLoading } = useSWR(
        `https://newsapi.org/v2/everything?q=pakistan&from=2025-01-25&sortBy=publishedAt&apiKey=${apiUrl}&page=${currentPage}&pageSize=${pageSize}`,
        fetcher
    )

    if (error) {
        console.error('Error fetching data:', error);
        return <h1 className="text-red-500 text-center text-2xl mt-10">Something went wrong</h1>
    }

    if (isLoading) {
        return <h1 className="text-blue-500 text-center text-2xl mt-10">Loading...</h1>
    }

    if (!data || !data.articles) {
        return <h1 className="text-gray-500 text-center text-2xl mt-10">No articles found</h1>
    }

    // Handler function for categories
    const handleCategory = async (category) => {
        try {
            mutate(data, false) // Optimistically update the UI
            const response = await fetcher(
                `https://newsapi.org/v2/everything?q=${category}&from=2025-01-25&sortBy=publishedAt&apiKey=${apiUrl}&page=${currentPage}&pageSize=${pageSize}`
            );
            mutate(response, false) // Update the data
        } catch (error) {
            mutate(data, false); // Revert to previous data on error
            console.error('Error fetching category data:', error)
        }
    };

    // Handler for pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    };

    // Handle search functionality
    const handleSearch = async () => {
        if (searchData.length === 0) 
            return // Ignore empty search

        try {
            mutate(data, false); // Optimistically update the UI
            const response = await fetcher(
                `https://newsapi.org/v2/everything?q=${searchData}&from=2025-01-25&sortBy=publishedAt&apiKey=${apiUrl}&page=${currentPage}&pageSize=${pageSize}`
            );
            mutate(response, false) // Update the data
        } catch (error) {
            mutate(data, false) // Revert to previous data on error
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Navbar */}
            <nav className="bg-white shadow-lg p-4 rounded-lg mb-6">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    {/* Logo */}
                    <h1 className="text-2xl font-bold text-blue-600">NewsApp</h1>

                    {/* Navigation Links */}
                    <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-center">
                        <a
                            href="#"
                            onClick={() => mutate(data, false)}
                            className="text-gray-700 hover:text-blue-600 transition duration-300"
                        >
                            All News
                        </a>
                        <a
                            href="#"
                            onClick={() => handleCategory('Trending')}
                            className="text-gray-700 hover:text-blue-600 transition duration-300"
                        >
                            Trending
                        </a>
                    </ul>

                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search Favourite News"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                            onChange={(event) => setSearchData(event.target.value.trim())}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </nav>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['Sports', 'Politics', 'Entertainment', 'Health', 'Education'].map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategory(category)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-800">Stay Updated with Latest News</p>
            </div>

            {/* Card Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.articles.map((article, index) => (
                    <Card key={index} article={article} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={data.articles.length < pageSize}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default NewsApp;
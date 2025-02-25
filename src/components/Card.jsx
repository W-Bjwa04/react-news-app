import React from 'react';

const Card = ({ article }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Article Image */}
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Article Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h2>

        {/* Description */}
        <p className="text-gray-600 mb-4">{article.description}</p>

        {/* Details (Author and Source) */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <small>Author: {article.author || 'Unknown'}</small>
          <small>Source: {article.source.name}</small>
        </div>

        {/* Published Date */}
        <small className="block text-sm text-gray-500 mb-4">
          Published: {new Date(article.publishedAt).toLocaleDateString()}
        </small>

        {/* Read More Link */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default Card;
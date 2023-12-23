'use client';


import useSWR from 'swr';
import PromptCard from "./PromptCard";
import React, { useState } from 'react';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const { data: allPosts, error } = useSWR('/api/prompt', fetcher);
  if (error) return <div>Failed to load</div>;
  if (!allPosts) return <div>Loading...</div>;

  const filteredPrompts = searchText
    ? allPosts.filter(post =>
        post.creator.username.includes(searchText) ||
        post.tag.includes(searchText) ||
        post.prompt.includes(searchText))
    : allPosts;

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(setTimeout(() => {
      // No need to call setSearchedResults here, as filteredPrompts will automatically update
    }, 500));
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          className='search_input peer'
        />
      </form>

      <PromptCardList data={filteredPrompts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;

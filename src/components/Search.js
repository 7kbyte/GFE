import React, { useState } from 'react';

const Search = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    }   
}
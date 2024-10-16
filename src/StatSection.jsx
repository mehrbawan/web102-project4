import React from 'react';

const StatSection = ({ title, data, excludedSet, toggleExclude }) => {
  return (
    <div className="stats-col">
      <h2>{title}</h2>
      {data.map((item, index) => {
        const isTypeSection = title.toLowerCase() === "types";  // Check if the section is for Types
        return (
          <button
            key={index}
            type={`${isTypeSection ? item.name : ''}`}
            className="attributeButton" // Conditional class for type
            onClick={() => toggleExclude(item.name)}
            {...(isTypeSection && { "data-type": item.name })} // Conditionally add 'data-type' attribute for types
          >
            {item.name}
          </button>
        );
      })}
      
      <div className="excluded-types-container">
        <h3>Excluding:</h3>
        {excludedSet.size > 0 ? (
          <ul>
            {Array.from(excludedSet).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No {title.toLowerCase()} excluded yet.</p>
        )}
      </div>
    </div>
  );
};

export default StatSection;
